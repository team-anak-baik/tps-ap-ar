import axios from "axios";

const api = axios.create({
  baseURL: process.env.APP_API_URL,
});

export default {
  async getDataMnt(page, filter) {
    try {
      const response = await api.get(`monitoring`, {
        params: {
          page: page,
          perPage: filter.perPage,
          status: filter.status,
          type: filter.type,
          step: filter.step,
          dateStart: filter.dateStart,
          dateEnd: filter.dateEnd,
        },
        timeout: 20000,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async exportData(filter) {
    try {
      const response = await api.get(`monitoring/exportData`, {
        params: {
          status: filter.status,
          type: filter.type,
          step: filter.step,
          dateStart: filter.dateStart,
          dateEnd: filter.dateEnd,
        },
        timeout: 20000,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async exportDetailData(code) {
    try {
      const response = await api.get(`monitoring/detail/exportData`, {
        params: {
          code: code,
        },
        timeout: 20000,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getDetailData(code, step) {
    try {
      const response = await api.get(`monitoring/detail`, {
        params: {
          code: code,
          step: step,
        },
        timeout: 20000,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async searchData(perPage, keyword) {
    try {
      const response = await api.get(`monitoring/search`, {
        params: {
          perPage: perPage,
          keyword: keyword,
        },
        timeout: 20000,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  },

  async countData(month) {
    try {
      const response = await api.get(`monitoring/countData`, {
        params: {
          month: month,
        },
        timeout: 20000,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getDataAg(filter) {
    try {
      const response = await api.get(`aging`, {
        params: {
          cutOffDue: filter.cutOffDue,
        },
        timeout: 20000,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getDetail(code, filter) {
    try {
      const response = await api.get(`aging/${code}`, {
        params: {
          cutOffDue: filter.cutOffDue,
        },
        timeout: 20000,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },
};
