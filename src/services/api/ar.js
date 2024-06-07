import axios from "axios";

const api_1 = axios.create({
  baseURL: process.env.APP_API_AR_URL_1,
});

const api_2 = axios.create({
  baseURL: process.env.APP_API_AR_URL_2,
});

export default {
  // distributor
  async getOc(filter, userid) {
    try {
      const order_customer = await api_1.get(`order_customer`, {
        params: {
          start_date: filter.startDate,
          end_date: filter.endDate,
          userid: userid,
        },
        timeout: 20000,
      });
      if (order_customer.data.status) {
        return order_customer.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getRoc(filter, userid) {
    try {
      const release_order_customer = await api_1.get(`release_order_customer`, {
        params: {
          start_date: filter.startDate,
          end_date: filter.endDate,
          userid: userid,
        },
        timeout: 20000,
      });
      if (release_order_customer.data.status) {
        return release_order_customer.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getSo(filter, userid) {
    try {
      const order = await api_1.get(`order`, {
        params: {
          start_date: filter.startDate,
          end_date: filter.endDate,
          userid: userid,
        },
        timeout: 20000,
      });
      if (order.data.status) {
        return order.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getDotps(filter, userid) {
    try {
      const order = await api_1.get(`delivery`, {
        params: {
          start_date: filter.startDate,
          end_date: filter.endDate,
          userid: userid,
        },
        timeout: 20000,
      });
      if (order.data.status) {
        return order.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getSowms(filter, userid) {
    try {
      const wms_order = await api_1.get(`wms_order`, {
        params: {
          start_date: filter.startDate,
          end_date: filter.endDate,
          userid: userid,
        },
        timeout: 20000,
      });
      if (wms_order.data.status) {
        return wms_order.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getDotpswms(filter, userid) {
    try {
      const wms_delivery = await api_1.get(`wms_delivery`, {
        params: {
          start_date: filter.startDate,
          end_date: filter.endDate,
          userid: userid,
        },
        timeout: 20000,
      });
      if (wms_delivery.data.status) {
        return wms_delivery.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getInvc(filter, userid) {
    try {
      const arInvh = await api_1.get(`arInvh`, {
        params: {
          start_date: filter.startDate,
          end_date: filter.endDate,
          userid: userid,
        },
        timeout: 20000,
      });
      if (arInvh.data.status) {
        return arInvh.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getRv(filter, userid) {
    try {
      const rv = await api_1.get(`rv`, {
        params: {
          start_date: filter.startDate,
          end_date: filter.endDate,
          userid: userid,
        },
        timeout: 20000,
      });
      if (rv.data.status) {
        return rv.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async fetchData(page, filter, userid) {
    try {
      const response = await api_1.get(`monitoring`, {
        params: {
          page: page,
          perPage: filter.perPage,
          start_date: filter.startDate,
          end_date: filter.endDate,
          userid: userid,
          step: filter.step,
          type: filter.type,
        },
        timeout: 20000,
      });
      if (response.data.status) {
        return response.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async getReceipt(code, userid) {
    try {
      const response = await api_1.get(`receipt`, {
        params: {
          code: code,
          userid: userid,
        },
        timeout: 20000,
      });
      if (response.data.status) {
        return response.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  },

  async searchData(keyword, filter, userid) {
    try {
      const response = await api_1.get(`searchdata`, {
        params: {
          keyword: keyword,
          userid: userid,
          perPage: filter.perPage,
        },
        timeout: 20000,
      });
      if (response.data.status) {
        return response.data.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  },

  async countData(type, userid, month) {
    try {
      const response = await api_1.get(`countdata`, {
        params: {
          userid: userid,
          month: month,
        },
        timeout: 20000,
      });
      if (response.status) {
        return response.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  },

  // toko
  async getDataToko(page, filter, dataToko) {
    try {
      const response = await api_2.get(`raReportSales`, {
        params: {
          page: page,
          storeCode: filter.storeCode,
          order_outlet_by: filter.order_outlet_by,
          perPage: dataToko.per_page,
          startDate: filter.startDate,
          endDate: filter.endDate,
        },
        timeout: 20000,
      });
      if (response.status) {
        return response.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  },

  async getTotalData(filter) {
    try {
      const response = await api_2.get(`raReportSalesTotal`, {
        params: {
          startDate: filter.startDate,
          endDate: filter.endDate,
        },
        timeout: 20000,
      });
      if (response.status) {
        return response.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  },

  async loadToko() {
    try {
      const response = await api_2.get(`loadDataUser`);
      if (response.status) {
        return response.data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  },

  // aging
  async getData(filter) {
    try {
      const response = await api_1.get(`getdataag`, {
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
      const response = await api_1.get(`getdataag/${code}`, {
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
