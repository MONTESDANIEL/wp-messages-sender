import axios from "axios";

const baseUrl = "http://192.168.1.8:8081/messages-queue";

export const addMessagesToQueue = async (messages, instance) => {
  try {
    const response = await axios.post(
      `${baseUrl}/addMessages/${instance}`,
      messages,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTextQueueForInstance = async (instance) => {
  try {
    const response = await axios.get(
      `${baseUrl}/getTextMessages/${instance}`,
      {}
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMediaQueueForInstance = async (instance) => {
  try {
    const response = await axios.get(
      `${baseUrl}/getMediaMessages/${instance}`,
      {}
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
