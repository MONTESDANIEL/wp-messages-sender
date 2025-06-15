import axios from "axios";

const baseUrl = "http://192.168.1.8:8081";

export const sendMassiveMediaMessages = async ({ messages }) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/messages/send-media-masive`,
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

export const fetchInstances = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/messages/fetch-instances`);
    return response.data; // Verifica que el backend esté devolviendo datos válidos
  } catch (error) {
    console.error("Error fetching instances:", error);
    throw error; // Asegúrate de manejar el error adecuadamente
  }
};
