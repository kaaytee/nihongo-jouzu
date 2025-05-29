// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import axios, { AxiosError } from 'axios'

// Updated Channels type
export type Channels = 'ipc-example' | 'capture-screen-snip';

// Define the backend URL from an environment variable, with a default
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    // Added invoke method for request/response IPC
    invoke(channel: Channels, ...args: unknown[]): Promise<any> {
      return ipcRenderer.invoke(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  api: {
    getDummyData: async () => {
      try {
        console.log("fetching data");
        const response = await axios.get(`${BACKEND_URL}/scan/translate`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching data (AxiosError):', error.message, error.response?.data);
        } else {
          console.error('Error fetching data (Unknown):', error);
        }
        throw error;
      }
    },
    sendImageToBackend: async (imageDataUrl: string) => {
      try {
        console.log('Sending image to backend...');
        const response = await axios.post(`${BACKEND_URL}/scan/receive-image`, {
          imageData: imageDataUrl,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Backend response:', response.data);
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Error sending image to backend (AxiosError):', error.message, error.response?.data);
        } else {
          console.error('Error sending image to backend (Unknown):', error);
        }
        throw error;
      }
    }
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);



export type ElectronHandler = typeof electronHandler;
