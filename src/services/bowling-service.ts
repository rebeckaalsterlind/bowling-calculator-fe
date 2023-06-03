import axios from "axios";

export class BowlingService {
  static async getScores() {
    try {
      const response = await axios.get("http://localhost:3000/");
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
