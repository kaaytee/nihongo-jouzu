from jamdict import Jamdict
from jamdict import jmdict
from typing import List, Dict, Union, Set
import logging

jam = Jamdict()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class KanjiInfo:
    def __init__(self, kanji: str, meanings: List[str], onYomi: List[str], kunYomi: List[str],
                 strokeCount: int, jlptLevel: str, frequency: int,
                 examples: List[Dict[str, str]], sentences: List[Dict[str, str]],
                 similar: List[Dict[str, str]]):
        self.kanji = kanji
        self.meanings = meanings
        self.onYomi = onYomi
        self.kunYomi = kunYomi
        self.strokeCount = strokeCount
        self.jlptLevel = jlptLevel
        self.frequency = frequency
        self.examples = examples
        self.sentences = sentences
        self.similar = similar

    def to_dict(self) -> Dict[str, Union[str, List[str], int, List[Dict[str, str]]]]:
        return self.__dict__

def get_jlpt_level_approx(grade: Union[int, None]) -> str:
    if grade is None or not isinstance(grade, int):
        return "N/A"
    if grade <= 2: return "N5"
    if grade <= 4: return "N4"
    if grade <= 6: return "N3"
    if grade == 8: return "N2"
    if grade > 8 : return "N1"
    return "N/A"


def search_kanji(search_term: str) -> Union[Dict[str, any], None]:
    if not search_term or len(search_term) != 1:
        logger.warning(f"Search term must be a single character: '{search_term}'")
        return None

    try:
        kanji_char_results = jam.lookup(f"k:{search_term}")
        if not kanji_char_results or not kanji_char_results.chars:
            logger.info(f"No character info found for Kanji: {search_term}")
            return None
        
        char_info = kanji_char_results.chars[0]
        kanji_literal = char_info.literal

        logger.info(f"[{kanji_literal}] Type of char_info: {type(char_info)}")
        char_idseq = getattr(char_info, 'idseq', None)
        logger.info(f"[{kanji_literal}] char_info.idseq: {char_idseq}")

        meanings = list(char_info.meanings()) if hasattr(char_info, 'meanings') and callable(char_info.meanings) else []
        
        on_yomi = []
        kun_yomi = []

        if char_idseq and jam.kd2:
            logger.info(f"[{kanji_literal}] Attempting direct DB query for readings using idseq: {char_idseq}")
            try:
                with jam.kd2.ctx() as ctx:
                    query = "SELECT r_type, value FROM reading WHERE idseq = ? AND r_type IN ('ja_on', 'ja_kun')"
                    rows = ctx.select(query, params=(char_idseq,))
                    raw_sql_readings = [(row['r_type'], row['value']) for row in rows]
                    logger.info(f"[{kanji_literal}] Raw readings from SQL query: {raw_sql_readings}")
                    for r_type, value in raw_sql_readings:
                        if r_type == 'ja_on':
                            on_yomi.append(value)
                        elif r_type == 'ja_kun':
                            kun_yomi.append(value)
                    if on_yomi or kun_yomi:
                        logger.info(f"[{kanji_literal}] Successfully extracted readings via direct SQL: OnYomi={on_yomi}, KunYomi={kun_yomi}")
                    else:
                        logger.info(f"[{kanji_literal}] Direct SQL query executed but found no ja_on/ja_kun readings for idseq {char_idseq}.")
            except Exception as e_sql:
                logger.error(f"[{kanji_literal}] Error during direct SQL query for readings: {e_sql}", exc_info=True)
        else:
            logger.warning(f"[{kanji_literal}] Skipping direct SQL query: char_idseq is missing or jam.kd2 is not available.")

        if not (on_yomi or kun_yomi):
            logger.info(f"[{kanji_literal}] SQL query did not yield readings or was skipped. Trying rm_groups.")
            if hasattr(char_info, 'rm_groups') and char_info.rm_groups:
                logger.info(f"[{kanji_literal}] Found {len(char_info.rm_groups)} rm_groups. Processing for readings.")
                for group in char_info.rm_groups:
                    if hasattr(group, 'readings') and group.readings:
                        for r in group.readings:
                            if hasattr(r, 'r_type') and hasattr(r, 'value'):
                                if r.r_type == 'ja_on':
                                    on_yomi.append(r.value)
                                elif r.r_type == 'ja_kun':
                                    kun_yomi.append(r.value)
                logger.info(f"[{kanji_literal}] Extracted from rm_groups: OnYomi={on_yomi}, KunYomi={kun_yomi}")
            else:
                logger.warning(f"[{kanji_literal}] char_info does not have rm_groups or it is empty.")

        if not (on_yomi or kun_yomi):
            logger.info(f"[{kanji_literal}] rm_groups did not yield readings. Trying direct attributes ja_on/ja_kun.")
            direct_on = list(char_info.ja_on) if hasattr(char_info, 'ja_on') and char_info.ja_on else []
            direct_kun = list(char_info.ja_kun) if hasattr(char_info, 'ja_kun') and char_info.ja_kun else []
            if direct_on or direct_kun:
                on_yomi.extend(direct_on)
                kun_yomi.extend(direct_kun)
                logger.info(f"[{kanji_literal}] Extracted from direct attributes: OnYomi={direct_on}, KunYomi={direct_kun}")
            else:
                logger.info(f"[{kanji_literal}] Direct attributes ja_on/ja_kun also empty or not found.")

        on_yomi = sorted(list(set(on_yomi)))
        kun_yomi = sorted(list(set(kun_yomi)))

        logger.info(f"[{kanji_literal}] Final OnYomi: {on_yomi}")
        logger.info(f"[{kanji_literal}] Final KunYomi: {kun_yomi}")

        stroke_count = char_info.stroke_count if hasattr(char_info, 'stroke_count') else 0
        jlpt_level = get_jlpt_level_approx(getattr(char_info, 'grade', None))
        frequency = getattr(char_info, 'freq', 0) or 0

        example_words_data: List[Dict[str, str]] = []
        word_lookup_query = f"%{kanji_literal}%"
        try:
            word_results = jam.lookup(word_lookup_query, lookup_chars=False, lookup_ne=False)
            if word_results and word_results.entries:
                processed_words: Set[str] = set()
                for entry in word_results.entries:
                    found_in_kanji_form = False
                    word_display = ""
                    
                    if entry.kanji_forms:
                        for k_form in entry.kanji_forms:
                            if k_form.text and kanji_literal in k_form.text:
                                word_display = k_form.text
                                found_in_kanji_form = True
                                break
                    
                    if not found_in_kanji_form:
                        continue

                    if word_display in processed_words:
                        continue

                    reading_display = entry.kana_forms[0].text if entry.kana_forms and entry.kana_forms[0].text else ""
                    
                    meaning_text = ""
                    if entry.senses and entry.senses[0].gloss:
                        first_gloss_item = entry.senses[0].gloss[0]
                        if isinstance(first_gloss_item, str):
                            meaning_text = first_gloss_item
                        elif hasattr(first_gloss_item, 'text') and isinstance(first_gloss_item.text, str):
                            meaning_text = first_gloss_item.text
                        elif isinstance(first_gloss_item, jmdict.Gloss):
                             meaning_text = first_gloss_item.text


                    if word_display and len(example_words_data) < 7:
                        example_words_data.append({
                            "word": word_display,
                            "reading": reading_display,
                            "meaning": meaning_text
                        })
                        processed_words.add(word_display)

        except Exception as e_ex:
            logger.error(f"Error fetching/processing example words for {kanji_literal}: {e_ex}", exc_info=True)


        similar_kanji_data: List[Dict[str, str]] = []
        processed_similar_kanji: Set[str] = set()
        
        sorted_kun_yomi = sorted([k for k in kun_yomi if k], key=len, reverse=True)
        on_yomi_to_search = [o for o in on_yomi if o]

        readings_to_process = sorted_kun_yomi + on_yomi_to_search
        
        logger.info(f"[{kanji_literal}] Finding related kanji. Prioritized Kun'yomi (longest first): {sorted_kun_yomi}, On'yomi: {on_yomi_to_search}")

        for reading in readings_to_process:
            if len(similar_kanji_data) >= 7:
                break

            try:
                query_str = reading
                logger.info(f"[{kanji_literal}] Looking up related kanji with general query for reading: '{query_str}'")
                
                reading_entry_results = jam.lookup(query_str, lookup_chars=False, lookup_ne=False) 
                
                if reading_entry_results and reading_entry_results.entries:
                    logger.info(f"[{kanji_literal}] Found {len(reading_entry_results.entries)} potential entries for reading string '{reading}'")
                    for entry in reading_entry_results.entries:
                        if len(similar_kanji_data) >= 7: break

                        if entry.kanji_forms:
                            for k_form in entry.kanji_forms:
                                if not k_form.text: continue
                                if len(similar_kanji_data) >= 7: break

                                logger.debug(f"[{kanji_literal}] Processing word entry: '{entry.text() if hasattr(entry, 'text') else 'N/A'}', k_form: '{k_form.text}' for original reading '{reading}'")

                                for char_in_word in k_form.text:
                                    if len(similar_kanji_data) >= 7: break
                                    if not ('\u4e00' <= char_in_word <= '\u9fef'):
                                        continue 
                                        
                                    if char_in_word == kanji_literal: 
                                        continue
                                    if char_in_word in processed_similar_kanji: 
                                        continue

                                    try:
                                        logger.debug(f"[{kanji_literal}] Checking relatedness of KANJI '{char_in_word}' (from word '{k_form.text}') with original reading '{reading}'")
                                        related_char_lookup = jam.lookup(f"k:{char_in_word}")
                                        if related_char_lookup and related_char_lookup.chars:
                                            related_char_info = related_char_lookup.chars[0]
                                            
                                            temp_on_related = []
                                            temp_kun_related = []
                                            if hasattr(related_char_info, 'rm_groups') and related_char_info.rm_groups:
                                                for group_rel in related_char_info.rm_groups:
                                                    if hasattr(group_rel, 'readings') and group_rel.readings:
                                                        for r_rel in group_rel.readings:
                                                            if hasattr(r_rel, 'r_type') and hasattr(r_rel, 'value'):
                                                                if r_rel.r_type == 'ja_on':
                                                                    temp_on_related.append(r_rel.value)
                                                                elif r_rel.r_type == 'ja_kun':
                                                                    temp_kun_related.append(r_rel.value)
                                            
                                            if not temp_on_related and hasattr(related_char_info, 'ja_on') and related_char_info.ja_on:
                                                temp_on_related.extend(list(related_char_info.ja_on))
                                            if not temp_kun_related and hasattr(related_char_info, 'ja_kun') and related_char_info.ja_kun:
                                                temp_kun_related.extend(list(related_char_info.ja_kun))

                                            temp_on_related = sorted(list(set(temp_on_related)))
                                            temp_kun_related = sorted(list(set(temp_kun_related)))

                                            related_meanings = list(related_char_info.meanings()) if hasattr(related_char_info, 'meanings') and callable(related_char_info.meanings) else []

                                            logger.debug(f"[{kanji_literal}] For '{char_in_word}': Original reading to check='{reading}'. Its OnYomi={temp_on_related}, KunYomi={temp_kun_related}, Meanings={related_meanings[:2]}")

                                            if reading in temp_on_related or reading in temp_kun_related:
                                                logger.info(f"[{kanji_literal}] Found related kanji: '{char_in_word}' shares reading '{reading}' (Source word: '{k_form.text}')")
                                                similar_kanji_data.append({
                                                    "kanji": char_in_word,
                                                    "shared_reading": reading,
                                                    "all_on_yomi": temp_on_related,
                                                    "all_kun_yomi": temp_kun_related,
                                                    "meanings": related_meanings[:3]
                                                })
                                                processed_similar_kanji.add(char_in_word)
                                            else:
                                                logger.debug(f"[{kanji_literal}] '{char_in_word}' does NOT share original reading '{reading}'.")
                                        else:
                                            logger.warning(f"[{kanji_literal}] No char_info for '{char_in_word}' when checking relatedness (source word: '{k_form.text}').")
                                    except Exception as e_related_check:
                                        logger.error(f"[{kanji_literal}] Error checking relatedness of '{char_in_word}' for reading '{reading}': {e_related_check}", exc_info=True)
                                        
                                if len(similar_kanji_data) >= 7: break
                else:
                    logger.info(f"[{kanji_literal}] No entries found for reading '{reading}'")

            except Exception as e_sim:
                logger.error(f"Error finding similar kanji for reading '{reading}' of {kanji_literal}: {e_sim}", exc_info=True)
        
        logger.info(f"[{kanji_literal}] Found {len(similar_kanji_data)} similar kanji in total.")

        sentences_data: List[Dict[str, str]] = []
        try:
            if 'word_results' in locals() and word_results and word_results.entries:
                for entry in word_results.entries:
                    if not any(k_form.text and kanji_literal in k_form.text for k_form in entry.kanji_forms if k_form.text):
                        continue

                    if entry.senses:
                        for sense in entry.senses:
                            if hasattr(sense, 'examples') and sense.examples:
                                for ex_item in sense.examples:
                                    japanese_sentence = ""
                                    english_sentence = ""
                                    if isinstance(ex_item, str): 
                                        pass
                                    elif hasattr(ex_item, 'text_elements') and isinstance(ex_item.text_elements, list):
                                        temp_jap = []
                                        temp_eng = []
                                        for el in ex_item.text_elements:
                                            if hasattr(el, 'lang') and hasattr(el, 'text'):
                                                if el.lang == 'jpn': temp_jap.append(el.text)
                                                elif el.lang == 'eng': temp_eng.append(el.text)
                                        if temp_jap:
                                            japanese_sentence = " ".join(temp_jap)
                                        if temp_eng:
                                             english_sentence = " ".join(temp_eng)
                                    else:
                                        logger.warning(f"[{kanji_literal}] Encountered an unexpected example item structure in sentences: type={type(ex_item)}, content={str(ex_item)[:100]}")


                                    if japanese_sentence and english_sentence and len(sentences_data) < 5:
                                        sentences_data.append({
                                            "japanese": japanese_sentence,
                                            "english": english_sentence,
                                            "reading": ""
                                        })
                                    if len(sentences_data) >= 5: break
                        if len(sentences_data) >= 5: break


        except Exception as e_sent:
            logger.error(f"Error processing sentences for {kanji_literal}: {e_sent}", exc_info=True)


        kanji_info_obj = KanjiInfo(
            kanji=kanji_literal,
            meanings=meanings,
            onYomi=on_yomi,
            kunYomi=kun_yomi,
            strokeCount=stroke_count,
            jlptLevel=jlpt_level,
            frequency=frequency,
            examples=example_words_data,
            sentences=sentences_data,
            similar=similar_kanji_data
        )
        return kanji_info_obj.to_dict()

    except Exception as e_main:
        logger.error(f"Critical error in search_kanji for '{search_term}': {e_main}", exc_info=True)
        return None


def _format_sense_for_frontend(sense: jmdict.Sense) -> Dict[str, any]:
    """Helper to format a single JMDSense object for frontend consumption."""
    glosses = []
    if sense.gloss:
        for g in sense.gloss:
            if isinstance(g, str):
                glosses.append(g)
            elif hasattr(g, 'text') and isinstance(g.text, str):
                glosses.append(g.text)
            elif isinstance(g, jmdict.Gloss):
                 glosses.append(g.text)


    pos = [str(p) for p in getattr(sense, 'pos', [])]
    misc = [str(m) for m in getattr(sense, 'misc', [])]
    field = [str(f) for f in getattr(sense, 'field', [])]
    dialect = [str(d) for d in getattr(sense, 'dial', [])]
    
    examples_data = []
    if hasattr(sense, 'examples') and sense.examples:
        for ex_item in sense.examples:
            japanese_sentence = ""
            english_sentence = ""
            if isinstance(ex_item, str):
                pass
            elif hasattr(ex_item, 'text_elements') and isinstance(ex_item.text_elements, list):
                temp_jap = []
                temp_eng = []
                for el in ex_item.text_elements:
                    if hasattr(el, 'lang') and hasattr(el, 'text'):
                        if el.lang == 'jpn': temp_jap.append(el.text)
                        elif el.lang == 'eng': temp_eng.append(el.text)
                if temp_jap:
                    japanese_sentence = " ".join(temp_jap)
                if temp_eng:
                    english_sentence = " ".join(temp_eng)
            
            if japanese_sentence and english_sentence and len(examples_data) < 3:
                examples_data.append({
                    "japanese": japanese_sentence,
                    "english": english_sentence,
                    "reading": ""
                })
    
    return {
        "glosses": glosses,
        "pos": pos,
        "misc": misc,
        "field": field,
        "dialect": dialect,
        "examples": examples_data
    }

def _format_entry_for_frontend(entry: jmdict.JMDEntry) -> Dict[str, any]:
    """Formats a JMDEntry object into a dictionary for frontend."""
    kanji_forms = [k.text for k in entry.kanji_forms if k.text]
    kana_forms = [k.text for k in entry.kana_forms if k.text]
    
    senses_data = []
    if entry.senses:
        for sense in entry.senses:
            senses_data.append(_format_sense_for_frontend(sense))
            
    return {
        "idseq": str(entry.idseq) if entry.idseq is not None else None,
        "kanji_forms": kanji_forms,
        "kana_forms": kana_forms,
        "senses": senses_data,
    }

def search_general(query_string: str) -> Dict[str, List[Dict[str, any]]]:
    """
    Performs a general search using Jamdict for words, kanji, kana, or English.
    If the query is a single Kanji, it also includes detailed Kanji information.
    """
    all_results: List[Dict[str, any]] = []
    processed_entry_keys: Set[tuple] = set()

    logger.info(f"Performing general search for: '{query_string}'")


    is_single_japanese_char = len(query_string) == 1 and (
        ('\\u4e00' <= query_string <= '\\u9fff') or 
        ('\\u3040' <= query_string <= '\\u309f') or 
        ('\\u30a0' <= query_string <= '\\u30ff') or 
        ('\\u3400' <= query_string <= '\\u4dbf') or 
        ('\\u20000' <= query_string <= '\\u2a6df') or 
        ('\\uff00' <= query_string <= '\\uffef')
    )
    
    if is_single_japanese_char: 
        logger.info(f"Query '{query_string}' is a single Kanji. Fetching detailed Kanji info.")
        kanji_detail_data = search_kanji(query_string)
        if kanji_detail_data:
            all_results.append({
                "type": "kanji_detail",
                "data": kanji_detail_data
            })
            processed_entry_keys.add(( (query_string,), (query_string,), tuple(kanji_detail_data.get("meanings", [])[:1]) ))


    try:
        lookup_results = jam.lookup(query_string) 
        
        entries_to_process = []
        if lookup_results and lookup_results.entries:
            logger.info(f"Found {len(lookup_results.entries)} entries for query '{query_string}'")
            entries_to_process.extend(lookup_results.entries)

        is_ascii_query = all(ord(c) < 128 for c in query_string)
        
        if is_ascii_query and query_string and not is_single_japanese_char and not entries_to_process:
            logger.info(f"Initial lookup for '{query_string}' yielded no results. Attempting English-specific search '{query_string}%eng'.")
            eng_lookup_results = jam.lookup(f"{query_string}%eng")
            if eng_lookup_results and eng_lookup_results.entries:
                logger.info(f"Found {len(eng_lookup_results.entries)} entries from English-specific search for '{query_string}%eng'")
                entries_to_process.extend(eng_lookup_results.entries)
            else:
                logger.info(f"English-specific search for '{query_string}%eng' also yielded no results.")
        
        if entries_to_process:
            logger.info(f"Processing {len(entries_to_process)} total entries for query '{query_string}'.")
            for entry in entries_to_process:
                formatted_entry = _format_entry_for_frontend(entry)
                
                key_kanji = tuple(sorted(formatted_entry["kanji_forms"]))
                key_kana = tuple(sorted(formatted_entry["kana_forms"]))
                first_gloss = ""
                if formatted_entry["senses"] and formatted_entry["senses"][0]["glosses"]:
                    first_gloss = formatted_entry["senses"][0]["glosses"][0]
                
                entry_key = (key_kanji, key_kana, first_gloss)

                if entry_key not in processed_entry_keys:
                    all_results.append({
                        "type": "word",
                        "data": formatted_entry
                    })
                    processed_entry_keys.add(entry_key)
                else:
                    logger.info(f"Skipping duplicate-like entry for key: {entry_key}")

        elif lookup_results and lookup_results.chars: 
            if not any(r['type'] == 'kanji_detail' and r['data']['kanji'] == query_string for r in all_results):
                logger.info(f"Query '{query_string}' matched as a character by general lookup. Fetching detailed Kanji info.")
                kanji_detail_data = search_kanji(query_string) 
                if kanji_detail_data:
                     all_results.append({
                        "type": "kanji_detail",
                        "data": kanji_detail_data
                    })
                     processed_entry_keys.add(( (query_string,), (query_string,), tuple(kanji_detail_data.get("meanings", [])[:1]) ))


    except Exception as e:
        logger.error(f"Error during general Jamdict lookup for '{query_string}': {e}", exc_info=True)

    logger.info(f"General search for '{query_string}' yielded {len(all_results)} results.")
    return {"results": all_results}


if __name__ == '__main__':
    # some tests
    if not logger.hasHandlers(): 
        logging.basicConfig(level=logging.DEBUG) 
        logging.getLogger('jamdict').setLevel(logging.INFO)
        logging.getLogger('puchikarui').setLevel(logging.INFO)
        logger.info("Logging set to DEBUG for __main__, INFO for jamdict/puchikarui.")
    
    test_kanji_list = ["日", "男"] 
    for test_k in test_kanji_list:
        logger.info(f"--- Testing Kanji: {test_k} ---")
        info = search_kanji(test_k)
        if info:
            logger.info(f"  Kanji: {info.get('kanji')}")
            logger.info(f"  Meanings: {', '.join(info.get('meanings', []))[:100]}") 
            logger.info(f"  OnYomi: {info.get('onYomi')}")
            logger.info(f"  KunYomi: {info.get('kunYomi')}")
            logger.info(f"  Examples ({len(info.get('examples',[]))}):")
            for ex in info.get('examples', [])[:2]: 
                logger.info(f"    - {ex.get('word')} ({ex.get('reading')}): {ex.get('meaning')}")
            logger.info(f"  Similar ({len(info.get('similar',[]))}):")
            for sim in info.get('similar', [])[:2]: 
                logger.info(f"    - {sim.get('kanji')} (Reason: {sim.get('reason')})")
            logger.info(f"  Sentences ({len(info.get('sentences',[]))}):")
            for sent in info.get('sentences', [])[:1]: 
                logger.info(f"    - JP: {sent.get('japanese')}, EN: {sent.get('english')}")
        else:
            logger.info(f"No information found or error for {test_k}")
        logger.info("-------------------------")

    logger.info("--- Testing General Search ---")
    test_queries = ["食べる", "たべる", "eat", "日", "日本", "kaisha", "会社", "水", "water", "mizu"]
    for query in test_queries:
        logger.info(f"--- General search for: {query} ---")
        general_results = search_general(query)
        logger.info(f"Found {len(general_results.get('results', []))} results.")
        for res_idx, res_item in enumerate(general_results.get('results', [])[:3]): 
            logger.info(f"  Result {res_idx+1} Type: {res_item.get('type')}")
            if res_item.get('type') == 'word':
                logger.info(f"    Word: K:{res_item['data'].get('kanji_forms')}, R:{res_item['data'].get('kana_forms')}")
                if res_item['data'].get('senses'):
                    logger.info(f"    Sense1: {res_item['data']['senses'][0].get('glosses')[:2]}") 
            elif res_item.get('type') == 'kanji_detail':
                logger.info(f"    Kanji: {res_item['data'].get('kanji')}, Meanings: {res_item['data'].get('meanings')[:2]}")
        logger.info("-------------------------")