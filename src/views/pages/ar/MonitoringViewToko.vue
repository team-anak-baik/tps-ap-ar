<template>
  <Pages :title="title">
    <!-- Halaman utama setelah login -->
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Data AR Hasil Penjualan di Toko</strong>
      </CCardHeader>
      <CCardBody>
        <CAlert
          class="d-flex align-items-center"
          variant="solid"
          :color="alert.color"
          :visible="alert.visible"
          dismissible
          @close="
            () => {
              alert.visible = false;
            }
          "
        >
          <CIcon :icon="alert.icon" class="flex-shrink-0 me-2" width="24" height="24" />
          <div>
            <strong>{{ alert.title }}</strong> {{ alert.message }}
          </div>
        </CAlert>
        <CRow class="align-items-start mb-3">
          <CCol>
            <CInputGroup>
              <CInputGroupText id="mySecondary">Outlet</CInputGroupText>
              <CFormSelect style="width: 12%" v-model="filter.storeCode">
                <option value="all">All</option>
                <option v-for="store in dataMasterStore" :value="store.storeCode">{{ store.storeName }}</option>
              </CFormSelect>
              <CInputGroupText id="mySecondary">Data</CInputGroupText>
              <CFormSelect style="width: 5%" v-model="dataToko.per_page">
                <option value="50">50 baris</option>
                <option value="100">100 baris</option>
                <option value="200">200 baris</option>
              </CFormSelect>

              <CInputGroupText id="mySecondary">Date Start</CInputGroupText>
              <input v-model="filter.startDate" style="width: 15%" type="date" class="form-control" />
              <CInputGroupText id="mySecondary">Date End</CInputGroupText>
              <input v-model="filter.endDate" style="width: 15%" type="date" class="form-control" />
              <div>
                <CButton v-c-tooltip="{ content: 'Filter data', placement: 'top' }" type="button" color="secondary" variant="outline" @click="functionsFilter()">
                  <CIcon icon="cil-filter" width="24" height="24" />
                </CButton>
              </div>
              <div>
                <download-excel :data="dataExcel" :fields="dataExcelField" worksheet="" :name="fileNameExcel">
                  <CButton v-c-tooltip="{ content: 'Export to excel', placement: 'top' }" type="button" color="secondary" variant="outline" @click="exportToExcel()">
                    <CIcon icon="cil-print" width="24" height="24" />
                  </CButton>
                </download-excel>
              </div>
            </CInputGroup>
          </CCol>
        </CRow>
        <div style="width: 100%; overflow: auto">
          <table v-if="dataToko.data.length > 0" class="table table-hover table-bordered text-center table-sm" style="font-size: 15px">
            <thead class="text-center">
              <tr class="table-secondary">
                <th rowspan="3" style="text-align: center; vertical-align: middle">NO</th>
                <th rowspan="3" style="text-align: center; vertical-align: middle">TOKO</th>
                <th rowspan="3" style="text-align: center; vertical-align: middle">TANGGAL TRANSAKSI</th>
                <th colspan="3">DATA SALES</th>
                <th colspan="20">RINCIAN</th>
                <!-- <th rowspan="3" style="text-align: center; vertical-align: middle;">ACTION</th> -->
              </tr>
              <tr class="table-secondary">
                <th rowspan="2" style="text-align: center; vertical-align: middle">HET</th>
                <th rowspan="2" style="text-align: center; vertical-align: middle">Discount</th>
                <th rowspan="2" style="text-align: center; vertical-align: middle">Grand Total</th>
                <th>Cash</th>
                <th>Debit BCA</th>
                <th>Debit Mandiri</th>
                <th>Debit Permata</th>
                <th>Kredit BCA</th>
                <th>Kredit Mandiri</th>
                <th>Kredit Permata</th>
                <th>Qris BCA</th>
                <th>Qris Mandiri</th>
                <th>Qris Permata</th>
                <th>Transfer WA</th>
                <th>Dana</th>
                <th>Shopee Pay</th>
                <th>OVO</th>
                <th>Indodana</th>
                <th>Grabmart</th>
                <th>Karyawan</th>
                <th>Credit Card</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tk, idx) in dataToko.data" :key="tk.id">
                <th>{{ dataToko.current_page * dataToko.per_page - dataToko.per_page + idx + 1 }}</th>
                <td class="px-3">{{ tk.store_code }}</td>
                <td class="px-3">{{ tk.transaction_date }}</td>
                <td class="px-3">{{ formatCurrencyIdr(tk.sub_total_amount) }}</td>
                <td class="px-3">{{ tk.disc_total > 0 ? formatCurrencyIdr(tk.disc_total) : "0" }}</td>
                <td class="px-3">{{ formatCurrencyIdr(tk.total_payment_amount) }}</td>

                <!-- Cash -->
                <td class="px-3">{{ tk.cash > 0 ? formatCurrencyIdr(tk.cash) : "0" }}</td>

                <!-- Debit -->
                <td class="px-3">{{ tk.bca > 0 ? formatCurrencyIdr(tk.bca) : "0" }}</td>
                <td class="px-3">{{ tk.mandiri > 0 ? formatCurrencyIdr(tk.mandiri) : "0" }}</td>
                <td class="px-3">{{ tk.permata > 0 ? formatCurrencyIdr(tk.permata) : "0" }}</td>

                <!-- Credit -->
                <td class="px-3">{{ tk.cc_bca > 0 ? formatCurrencyIdr(tk.cc_bca) : "0" }}</td>
                <td class="px-3">{{ tk.cc_mandiri > 0 ? formatCurrencyIdr(tk.cc_mandiri) : "0" }}</td>
                <td class="px-3">{{ tk.cc_permata > 0 ? formatCurrencyIdr(tk.cc_permata) : "0" }}</td>

                <!-- Qris -->
                <td class="px-3">{{ tk.qris_bca > 0 ? formatCurrencyIdr(tk.qris_bca) : "0" }}</td>
                <td class="px-3">{{ tk.qris_mandiri > 0 ? formatCurrencyIdr(tk.qris_mandiri) : "0" }}</td>
                <td class="px-3">{{ tk.qris_permata > 0 ? formatCurrencyIdr(tk.qris_permata) : "0" }}</td>

                <!-- Transfer -->
                <td class="px-3">{{ tk.transfer_wa > 0 ? formatCurrencyIdr(tk.transfer_wa) : "0" }}</td>

                <!-- Dana -->
                <td class="px-3">{{ tk.dana > 0 ? formatCurrencyIdr(tk.dana) : "0" }}</td>

                <!-- Shopee Pay -->
                <td class="px-3">{{ tk.shopee_pay > 0 ? formatCurrencyIdr(tk.shopee_pay) : "0" }}</td>

                <!-- Ovo -->
                <td class="px-3">{{ tk.ovo > 0 ? formatCurrencyIdr(tk.ovo) : "0" }}</td>

                <!-- Indodana -->
                <td class="px-3">{{ tk.indodana > 0 ? formatCurrencyIdr(tk.indodana) : "0" }}</td>

                <!-- Grabmart -->
                <td class="px-3">{{ tk.grabmart > 0 ? formatCurrencyIdr(tk.grabmart) : "0" }}</td>

                <!-- Karyawan -->
                <td class="px-3">{{ tk.karyawan > 0 ? formatCurrencyIdr(tk.karyawan) : "0" }}</td>

                <!-- Kartu Kredit -->
                <td class="px-3">{{ tk.cc > 0 ? formatCurrencyIdr(tk.cc) : "0" }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="dataToko.last_page > 1" class="pt-3">
          <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li v-if="dataToko.displayPage[0] > 1">
                <a class="page-link text-dark" href="javascript:void(0)" @click="getData(1)">First</a>
              </li>

              <li class="page-item" :class="{ disabled: dataToko.current_page === 1 }">
                <a class="page-link text-dark" href="javascript:void(0)" aria-label="Previous" @click="getData(dataToko.current_page - 1)">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>

              <li v-for="pageNumber in dataToko.displayPage" :key="pageNumber" class="page-item" :class="{ active: pageNumber === dataToko.current_page }">
                <a class="page-link text-dark" href="javascript:void(0)" @click="getData(pageNumber)">{{ pageNumber }}</a>
              </li>

              <li class="page-item" :class="{ disabled: dataToko.current_page === dataToko.last_page }">
                <a class="page-link text-dark" href="javascript:void(0)" aria-label="Next" @click="getData(dataToko.current_page + 1)">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>

              <li v-if="dataToko.displayPage[dataToko.displayPage.length - 1] < dataToko.last_page">
                <a class="page-link text-dark" href="javascript:void(0)" @click="getData(dataToko.last_page)">Last</a>
              </li>
            </ul>
          </nav>
        </div>
      </CCardBody>
    </CCard>

    <CCard v-if="dataToko.data.length > 0" class="mb-4">
      <CCardHeader>
        <h5>Overviews</h5>
        <strong>{{ filter.startDate }} - {{ filter.endDate }}</strong>
      </CCardHeader>
      <CCardBody>
        <div class="row g-2">
          <div v-for="data in totalData" class="col-md-3">
            <CCard class="mb-3">
              <CCardHeader class="text-center">
                <strong>{{ data.store_name }} ({{ data.store_code }})</strong>
              </CCardHeader>
              <CCardBody class="text-center"> Rp{{ formatCurrencyIdr(parseInt(data.total_amount)) }} </CCardBody>
            </CCard>
          </div>
          <CCard class="mb-3">
            <CCardHeader class="text-center">
              <strong>TOTAL SALES</strong>
            </CCardHeader>
            <CCardBody class="text-center"> Rp{{ formatCurrencyIdr(parseInt(totalSales)) }} </CCardBody>
          </CCard>
        </div>
      </CCardBody>
    </CCard>
  </Pages>
</template>

<script>
import Pages from "@/components/template/Pages.vue";
import ApiService from "@/services/api/ar.js";

export default {
  components: {
    Pages,
  },
  data() {
    return {
      title: "A/R MONITORING",

      dataMasterStore: [],
      dataToko: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: "50",
        prev_page_url: null,
        next_page_url: null,

        displayPage: [],
        totalDisplayPage: 3,
      },
      totalPaymentAmount: 0,
      totalData: [],
      filter: {
        storeCode: "all",
        order_outlet_by: "asc",
        perPage: "200",
        startDate: null,
        endDate: null,
      },
      alert: {
        color: "primary",
        visible: false,
        title: "",
        message: "",
        icon: "",
      },

      payment_code: {
        cash: "cash",
        bca: "bca", // Debit
        mandiri: "mandiri", // Debit
        permata: "permata", // Debit
        cc: "cc",
        cc_bca: "cc_bca",
        cc_mandiri: "cc_mandiri",
        cc_permata: "cc_permata",
        qris_bca: "qris_bca",
        qris_mandiri: "qris_mandiri",
        qris_permata: "qris_permata",
        shopee_pay: "shopee_pay",
        indodana: "indodana",
        grabmart: "grabmart",
        ovo: "ovo",
        dana: "dana",
        transfer_wa: "transfer_wa",
        qris_bca: "qris_bca",
        qris_mandiri: "qris_mandiri",
        qris_permata: "qris_permata",
        karyawan: "karyawan",
      },

      dataExcel: [],
      dataExcelField: {},
      fileNameExcel: "monitoring toko.xls",
    };
  },

  async mounted() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const current_date = `${year}-${month}-${day}`;

    this.filter.startDate = current_date;
    this.filter.endDate = current_date;

    await this.loadToko();
    await this.getData();
    // await this.countData();
    await this.getTotalData();
  },

  computed: {
    totalSales() {
      return this.totalData.reduce((sum, data) => sum + parseInt(data.total_amount), 0);
    },
  },

  methods: {
    async functionsFilter() {
      await this.getData();
      // await this.countData();
      await this.getTotalData();
    },

    async loadToko() {
      try {
        this.$root.loader = true;
        const data = await ApiService.loadToko();
        const resData = data;
        console.log(resData);
        this.dataMasterStore = resData.getAllStoreOutlet;
        console.log(this.dataMasterStore);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async getData(page = 1) {
      try {
        this.$root.loader = true;
        const response = await ApiService.getDataToko(page, this.filter, this.dataToko);
        const data = response;
        console.log(data);
        if (data.length > 0) {
          const totalRow = data[0].total_rows;
          this.dataToko.last_page = Math.ceil(totalRow / this.dataToko.per_page);
          this.dataToko.current_page = page;
          // console.log(this.dataToko.last_page);
          this.dataToko.data = response;
          this.dataToko.data = response.map((x) => {
            return x;
          });
          console.log(response);
          // console.log(this.dataToko.displayPage);

          console.log(this.dataToko);
          this.getAlert("cil-check-circle", "success", "", `${data[0].total_rows} data ditemukan.`);
          // console.log(data[0].total_rows);
        } else {
          this.dataToko.data = [];
          this.dataToko.last_page = 1;
          this.dataToko.current_page = 1;
          this.getAlert("cil-warning", "danger", "", "Data tidak ditemukan.");
        }
        this.updateDisplayPageToko();

        this.dataExcel = data.map((x, idx) => {
          return {
            ...x,
            no_urut: idx + 1,
          };
        });
      } catch (error) {
        // Handle errors
        this.getAlert("cil-warning", "danger", "", "Error fetching data.");
        console.error("Error fetching user data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async exportToExcel() {
      try {
        this.$root.loader = true;
        if (!this.dataToko.data) {
          this.getAlert("cil-warning", "danger", "Error!", "No data available to export.");
          return;
        }
        this.dataExcelField = {
          No: "no_urut",
          "Kode Toko": "store_code",
          "Tanggal Transaksi": "transaction_date",
          HET: "sub_total_amount",
          Discount: "disc_total",
          "Grand Total": "total_payment_amount",
          Cash: "cash",
          "Debit BCA": "bca",
          "Debit Mandiri": "mandiri",
          "Debit Permata": "permata",
          "Kredit BCA": "cc_bca",
          "Kredit Mandiri": "cc_mandiri",
          "Kredit Permata": "cc_permata",
          "Qris BCA": "qris_bca",
          "Qris Mandiri": "qris_mandiri",
          "Qris Permata": "qris_permata",
          "Transfer WA": "transfer_wa",
          Dana: "dana",
          "Shopee Pay": "shopee_pay",
          OVO: "ovo",
          Indodana: "indodana",
          Grabmart: "grabmart",
          Karyawan: "karyawan",
          "Credit Card": "cc",
          // 'Custom Val' : {callback:(data)=>{
          //     //condition
          //     return data;
          // }}
        };
        console.log(this.dataExcel);
      } catch (error) {
      } finally {
        this.$root.loader = false;
      }
    },

    async getTotalData() {
      try {
        // this.$root.loader = true;
        const response = await ApiService.getTotalData(this.filter);
        this.totalData = response;
        console.log(this.totalData);
      } catch (error) {
        console.log(error);
      } finally {
        // this.$root.loader = false;
      }
    },

    updateDisplayPageToko() {
      const halfDisplayedPages = Math.floor(this.dataToko.totalDisplayPage / 2);

      let startPage = Math.max(1, this.dataToko.current_page - halfDisplayedPages);
      let endPage = Math.min(this.dataToko.last_page, startPage + this.dataToko.totalDisplayPage - 1);

      if (endPage - startPage + 1 < this.dataToko.totalDisplayPage) {
        startPage = Math.max(1, endPage - this.dataToko.totalDisplayPage + 1);
      }

      this.dataToko.displayPage = Array.from(
        {
          length: endPage - startPage + 1,
        },
        (_, i) => startPage + i
      );
    },

    calculatePages() {
      const startPage = Math.max(1, this.dataToko.current_page - 1);
      const endPage = Math.min(startPage + 2, this.dataToko.last_page);

      return Array.from(
        {
          length: endPage - startPage + 1,
        },
        (_, i) => startPage + i
      );
    },

    getAlert(icon, color, title, message, timeout = 3000) {
      this.alert.icon = icon;
      this.alert.color = color;
      this.alert.title = title;
      this.alert.message = message;
      this.alert.visible = true;

      setTimeout(() => {
        this.alert.visible = false;
      }, timeout);
    },

    formatCurrencyIdr(price) {
      const number = parseFloat(price);
      if (isNaN(number)) {
        return;
      }
      const formattedPrice = number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return formattedPrice;
    },

    formatDateToDDMMYYYY(dateString) {
      if (!dateString) return null;
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },
  },
};
</script>

<style>
.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#mySecondary {
  background-color: rgb(226, 227, 229);
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 9999px inset;
  color: rgb(0, 0, 0);
}
</style>

<style scoped>
.pagination a {
  color: black !important;
}

.pagination .active a {
  color: white !important;
  background-color: #6c757d !important;
  border-color: #6c757d !important;
}
</style>
