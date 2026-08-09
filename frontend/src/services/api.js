export const api = {
  /**
   * Starts a new interview session.
   * @param {string} sessionId - The unique ID for the session.
   * @param {object} candidate - The candidate object.
   * @returns {Promise<{reply: string, done: boolean}>}
   */
  startInterview: async (sessionId, candidate) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          candidate
        }),
      });

      if (!response.ok) {
        let errMessage = `HTTP error! status: ${response.status}`;
        try {
          const errData = await response.json();
          if (errData?.error) errMessage = errData.error;
        } catch (_) {}
        throw new Error(errMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Error starting interview:", error);
      throw error;
    }
  },

  /**
   * Sends a message in an ongoing interview session.
   * @param {string} sessionId - The unique ID for the session.
   * @param {string} message - The candidate's message/answer.
   * @returns {Promise<{reply: string, done: boolean, feedback?: object}>}
   */
  sendInterviewMessage: async (sessionId, message) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message
        }),
      });

      if (!response.ok) {
        let errMessage = `HTTP error! status: ${response.status}`;
        try {
          const errData = await response.json();
          if (errData?.error) errMessage = errData.error;
        } catch (_) {}
        throw new Error(errMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending interview message:", error);
      throw error;
    }
  }
};
