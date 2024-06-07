<template>
  <Pages :title="title">
    <!-- Halaman utama setelah login -->
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Data AR Hasil Penjualan dengan Distributor</strong>
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
              <CInputGroupText id="mySecondary">Data</CInputGroupText>
              <CFormSelect v-model="filter.perPage">
                <option value="50">50 baris</option>
                <option value="100">100 baris</option>
                <option value="200">200 baris</option>
              </CFormSelect>
              <CInputGroupText id="mySecondary">Step</CInputGroupText>
              <CFormSelect style="width: 10%" v-model="filter.step">
                <option value="all">All</option>
                <option value="po">Purchase Order</option>
                <option value="do">Delivery Order</option>
                <option value="inv">Invoice</option>
                <option value="rv">Receipt Voucher</option>
              </CFormSelect>
              <!-- <CInputGroupText id="mySecondary">Status</CInputGroupText>
                        <CFormSelect>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Finish">Finish</option>
                        </CFormSelect> -->

              <CInputGroupText id="mySecondary">Date Start</CInputGroupText>
              <input v-model="filter.startDate" style="width: 16%" type="date" class="form-control" />
              <CInputGroupText id="mySecondary">Date End</CInputGroupText>
              <input v-model="filter.endDate" style="width: 16%" type="date" class="form-control" />
              <div>
                <CButton v-c-tooltip="{ content: 'Load data', placement: 'top' }" type="button" color="secondary" variant="outline" @click="getData()">
                  <CIcon icon="cilCloudDownload" width="24" height="24" />
                </CButton>
              </div>
              <div>
                <CButton v-c-tooltip="{ content: 'Filter data', placement: 'top' }" type="button" color="secondary" variant="outline" @click="fetchData()">
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
        <CRow class="align-items-start mb-3">
          <CCol md="12">
            <CInputGroup>
              <CFormInput v-model="keyword" placeholder="Search..." />
              <CButton v-c-tooltip="{ content: 'Search data', placement: 'top' }" type="button" color="secondary" variant="outline" @click="searchData()">
                <CIcon icon="cil-search" width="24" height="24" />
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
        <div style="width: 100%; overflow: auto" v-if="dataDistributor && dataDistributor.data && dataDistributor.data.length > 0">
          <table class="table table-striped table-hover table-bordered text-center table-sm" style="font-size: 16px">
            <thead class="text-center">
              <tr class="table-secondary">
                <th rowspan="2" style="text-align: center; vertical-align: middle">NO</th>
                <th rowspan="2" style="text-align: center; vertical-align: middle">TANGGAL TRANSAKSI</th>
                <th rowspan="2" style="text-align: center; vertical-align: middle">NAMA CUSTOMER</th>
                <th colspan="3">PO</th>
                <th colspan="3">DO</th>
                <th colspan="4">INVOICE</th>
                <th rowspan="2">RECEIPT VOUCHER</th>
                <th rowspan="2" style="text-align: center; vertical-align: middle">AR AMOUNT</th>
                <!-- <th rowspan="2" style="text-align: center; vertical-align: middle;">STATUS</th> -->
              </tr>
              <tr class="table-secondary">
                <th>No.PO</th>
                <th>Date</th>
                <th>Unit</th>
                <th>No.DO</th>
                <th>Date</th>
                <th>Unit</th>
                <th>No.Invoice</th>
                <th>Date</th>
                <th>Unit</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr v-for="(dis, idx) in dataDistributor.data">
                <th class="cell">{{ (dataDistributor.current_page - 1) * dataDistributor.per_page + idx + 1 }}</th>
                <td class="cell">{{ dis.tanggalPO }}</td>
                <td class="cell">{{ dis.namaCustomer }}</td>
                <td class="cell">{{ dis.nomorPO }}</td>
                <td class="cell">{{ dis.tanggalPO }}</td>
                <td class="cell">{{ dis.unitPO }}</td>
                <td class="cell" v-if="dis.nomorDO">{{ dis.nomorDO }}</td>
                <td class="cell" v-if="dis.nomorDO">{{ dis.tanggalDO }}</td>
                <td class="cell" v-if="dis.nomorDO">{{ dis.unitDO }}</td>
                <td class="cell" v-if="!dis.nomorDO" colspan="3">
                  <CButton v-c-tooltip="{ content: 'DO not found', placement: 'top' }" color="danger">
                    <CIcon icon="cil-x-circle" :width="30" :height="20" />
                  </CButton>
                </td>
                <td class="cell" v-if="dis.docnum">{{ dis.docnum }}</td>
                <td class="cell" v-if="!dis.docnum" colspan="4">
                  <CButton v-c-tooltip="{ content: 'Invoice not found', placement: 'top' }" color="danger">
                    <CIcon icon="cil-x-circle" :width="30" :height="20" />
                  </CButton>
                </td>
                <td class="cell" v-if="dis.docdate">{{ dis.docdate }}</td>
                <td class="cell" v-if="dis.docnum">{{ dis.unitDO }}</td>
                <td class="cell" v-if="dis.docnum">{{ formatCurrencyIdr(dis.doctotalamt) }}</td>
                <!-- <td class="cell" v-if="dis.no_rv">{{ dis.no_rv }}</td> -->
                <!-- <td class="cell" v-else>-</td> -->
                <td class="cell">
                  <CButton v-if="dis.receipt && dis.aramt == 0" v-c-tooltip="{ content: 'Detail Receipt Voucher', placement: 'top' }" color="success" style="font-size: 15px" @click="getReceipt(dis.docnum)">{{ dis.receipt }} RV</CButton>
                  <CButton v-if="dis.aramt != 0 && dis.receipt" v-c-tooltip="{ content: 'Detail Receipt Voucher', placement: 'top' }" color="primary" style="font-size: 15px" @click="getReceipt(dis.docnum)">{{ dis.receipt }} RV</CButton>
                  <CButton v-if="!dis.receipt && dis.docnum" v-c-tooltip="{ content: 'Receipt Voucher on process', placement: 'top' }" color="warning">
                    <CIcon icon="cib-safari" :width="30" :height="20" />
                  </CButton>
                  <CButton v-if="!dis.docnum" v-c-tooltip="{ content: 'Receipt Voucher not found', placement: 'top' }" color="danger">
                    <CIcon icon="cil-x-circle" :width="30" :height="20" />
                  </CButton>
                </td>
                <td v-if="dis.receipt" class="cell">{{ formatCurrencyIdr(dis.aramt) }}</td>
                <td class="cell" v-else>-</td>
                <td class="cell" v-else>-</td>
                <!-- <td v-else>-</td> -->
                <!-- <td class="cell">{{ dis.docnum !== null ? ((dis.doctotalamt - dis.totamount) == 0 ? status.finish : status.process) : '' }}</td> -->
              </tr>
            </tbody>
          </table>
        </div>

        <nav aria-label="Page navigation" class="mt-2" v-if="dataDistributor && dataDistributor.data && dataDistributor.last_page > 1">
          <CButtonGroup role="group" aria-label="First group">
            <CButton type="button" color="secondary" variant="outline" v-if="dataDistributor.current_page > 1" @click="fetchData(1)">First</CButton>
            <CButton type="button" color="secondary" variant="outline" :disabled="dataDistributor.current_page === 1" @click="fetchData(dataDistributor.current_page - 1)">&#60;</CButton>
            <template v-for="page in calculatePages()">
              <CButton type="button" color="secondary" variant="outline" @click="fetchData(page)" :class="{ active: page === dataDistributor.current_page }">{{ page }}</CButton>
            </template>
            <CButton type="button" color="secondary" variant="outline" :disabled="dataDistributor.current_page === dataDistributor.last_page" @click="fetchData(dataDistributor.current_page + 1)">&#62;</CButton>
            <CButton type="button" color="secondary" variant="outline" v-if="dataDistributor.current_page < dataDistributor.last_page" @click="fetchData(dataDistributor.last_page)">Last</CButton>
          </CButtonGroup>
        </nav>

        <!-- <div v-if="dataDistributor.last_page > 1">
                <nav aria-label="Page navigation example">
                    <ul class="pagination">

                        <li v-if="dataDistributor.displayPage[0] > 1">
                            <a class="page-link text-dark" href="javascript:void(0)" @click="getData(1)">First</a>
                        </li>

                        <li class="page-item" :class="{ 'disabled': dataDistributor.current_page === 1 }">
                            <a class="page-link text-dark" href="javascript:void(0)" aria-label="Previous" @click="getData(dataDistributor.current_page - 1)">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>

                        <li v-for="pageNumber in dataDistributor.displayPage" :key="pageNumber" class="page-item" :class="{ 'active': pageNumber === dataDistributor.current_page }">
                            <a class="page-link text-dark" href="javascript:void(0)" @click="getData(pageNumber)">{{ pageNumber }}</a>
                        </li>

                        <li class="page-item" :class="{ 'disabled': dataDistributor.current_page === dataDistributor.last_page }">
                            <a class="page-link text-dark" href="javascript:void(0)" aria-label="Next" @click="getData(dataDistributor.current_page + 1)">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>

                        <li v-if="dataDistributor.displayPage[dataDistributor.displayPage.length - 1] < dataDistributor.last_page">
                            <a class="page-link text-dark" href="javascript:void(0)" @click="getData(dataDistributor.last_page)">Last</a>
                        </li>

                    </ul>
                </nav>
            </div> -->
      </CCardBody>
    </CCard>
  </Pages>
  <CModal
    backdrop="static"
    alignment="center"
    :visible="modalReceipt.visible"
    @close="
      () => {
        (modalReceipt.visible = false), $root.defaultContainer();
      }
    "
    aria-labelledby="StaticBackdropExampleLabel"
  >
    <CModalHeader v-if="modalReceipt.isData">
      <CModalTitle>No.Invoice: {{ receipt.invoice }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <table class="table table-hover table-bordered table-striped table-sm text-center" style="font-size: 15px">
        <thead class="align-middle">
          <tr class="table-secondary">
            <th>No</th>
            <th>No.RV</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody v-if="modalReceipt.isData">
          <tr v-for="(rv, idx) in receipt.voucher" :key="rv.no_rv">
            <th>{{ idx + 1 }}</th>
            <td class="cell">{{ rv.no_rv }}</td>
            <!-- <td class="cell" >{{ rv.tgl_rv }}</td> -->
            <td class="cell">{{ rv.rv_date }}</td>
            <td class="cell">{{ formatCurrencyIdr(rv.totamount) }}</td>
          </tr>
        </tbody>
      </table>
    </CModalBody>
  </CModal>
</template>

<style>
.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

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

      dataOc: [],
      dataRoc: [],
      dataSo: [],
      dataDotps: [],
      dataSowms: [],
      dataDotpswms: [],
      dataInvc: [],
      dataRv: [],
      totalData: "",
      dataDistributor: [],
      modalReceipt: {
        visible: false,
        isData: false,
      },
      receipt: null,
      filter: {
        // pageSize: '10',
        startDate: null,
        endDate: null,
        perPage: "50",
        step: "all",
        type: "lengkap",
      },
      status: {
        finish: "Finish",
        process: "Process",
      },
      alert: {
        color: "",
        visible: false,
        title: "",
        message: "",
        icon: "",
      },
      userid: "",
      keyword: "",

      dataExcel: [],
      dataExcelField: {},
      fileNameExcel: "Monitoring Distributor.xls",
    };
  },
  async mounted() {
    this.userid = 1;
    await this.fetchData();
  },

  // async mounted() {
  //     await this.getData();
  // },

  methods: {
    async getData() {
      try {
        if (this.filter.startDate && this.filter.endDate) {
          this.$root.loader = true;

          const order_customer = await ApiService.getOc(this.filter, this.userid);
          this.dataOc = order_customer;
          console.log(this.dataOc);

          const release_order_customer = await ApiService.getRoc(this.filter, this.userid);
          this.dataRoc = release_order_customer;
          console.log(this.dataRoc);

          const order = await ApiService.getSo(this.filter, this.userid);
          this.dataSo = order;
          console.log(this.dataSo);

          const delivery = await ApiService.getDotps(this.filter, this.userid);
          this.dataDotps = delivery;
          console.log(this.dataDotps);

          const wms_order = await ApiService.getSowms(this.filter, this.userid);
          this.dataSowms = wms_order;
          console.log(this.dataSowms);

          const wms_delivery = await ApiService.getDotpswms(this.filter, this.userid);
          this.dataDotpswms = wms_delivery;
          console.log(this.dataDotpswms);

          const arInvh = await ApiService.getInvc(this.filter, this.userid);
          this.dataInvc = arInvh;
          console.log(this.dataInvc);

          const rv = await ApiService.getRv(this.filter, this.userid);
          this.dataRv = rv;
          console.log(this.dataRv);

          this.totalData = this.dataOc.total + this.dataRoc.total + this.dataSo.total + this.dataDotps.total + this.dataSowms.total + this.dataDotpswms.total + this.dataInvc.total + this.dataRv.total;
          console.log(this.totalData);

          this.getAlert("cil-check-circle", "success", "Success", `${this.totalData} data berhasil ditambahkan.`);
        } else {
          this.getAlert("cil-warning", "danger", "Error!", "Silahkan masukkan rentang tanggal.");
        }
      } catch (error) {
        this.getAlert("cil-warning", "danger", "Error!", "Data tidak ditemukan.");
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async fetchData(page = 1) {
      try {
        this.$root.loader = true;

        if (this.filter.step != "all" && !this.filter.startDate && !this.filter.endDate) {
          this.getAlert("cil-warning", "danger", "Error!", "Silahkan masukkan rentang tanggal.");
          return;
        }

        const data = await ApiService.fetchData(page, this.filter, this.userid);
        console.log(data);

        this.dataDistributor = data;
        console.log(this.dataDistributor);
        this.getAlert("cil-check-circle", "success", "Success", `${this.dataDistributor.total} data ditemukan.`);
      } catch (error) {
        this.getAlert("cil-warning", "danger", "Error!", "Data tidak ditemukan.");
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async getReceipt(code) {
      try {
        this.$root.loader = true;

        const data = await ApiService.getReceipt(code, this.userid);
        console.log(data);

        this.receipt = data;
        console.log(this.receipt);
        this.modalReceipt.isData = true;
        this.modalReceipt.visible = true;
      } catch (error) {
        this.getAlert("cil-warning", "danger", "Error!", "Data tidak ditemukan.");
        console.error("Error fetching user data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async searchData() {
      try {
        this.$root.loader = true;

        const data = await ApiService.searchData(this.keyword, this.filter, this.userid);
        console.log(data);

        this.dataDistributor = data;
        if (this.dataDistributor.total > 0) {
          this.getAlert("cil-check-circle", "success", "Success", `${this.dataDistributor.total} data ditemukan.`);
        } else {
          this.getAlert("cil-warning", "danger", "Error!", "Data tidak ditemukan.");
        }
      } catch (error) {
        this.getAlert("cil-warning", "danger", "Error!", "Data tidak ditemukan.");
        console.error("Error fetching user data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async exportToExcel() {
      if (!this.dataDistributor || !this.dataDistributor.data) {
        this.getAlert("cil-warning", "danger", "Error!", "No data available to export.");
        return;
      }

      this.dataExcel = this.dataDistributor.data.map((x, idx) => {
        return {
          ...x,
          no_urut: idx + 1,
        };
      });
      this.dataExcelField = {
        No: "no_urut",
        "Tanggal Transaksi": "tanggalPO",
        "Nama Customer": "namaCustomer",
        "Nomor PO": "nomorPO",
        "Tanggal PO": "tanggalPO",
        "Unit PO": "unitPO",
        "Nomor DO": "nomorDO",
        "Tanggal DO": "tanggalDO",
        "Unit DO": "unitDO",
        "Nomor Invoice": "docnum",
        "Tanggal Invoice": "docdate",
        "Unit Invoice": "unitDO",
        "Amount Invoice": "doctotalamt",
        "Nomor Receipt Voucher": "no_rv",
        "Tanggal Receipt Voucher": "rv_date",
        "Amount Receipt Voucher": "totamount",
        "AR Amount": {
          callback: (data) => {
            const totalAmount = parseFloat(data.doctotalamt) || 0;
            const totalReceipt = parseFloat(data.totamount) || 0;
            console.log(`doctotalamt: ${totalAmount}, totamount: ${totalReceipt}, AR Amount: ${totalAmount - totalReceipt}`);
            return totalAmount - totalReceipt;
          },
        },
      };

      // Convert data to an array of objects with mapped fields
      const exportData = this.dataExcel.map((item) => {
        const row = {};
        for (const [key, value] of Object.entries(this.dataExcelField)) {
          if (typeof value === "function") {
            row[key] = value(item);
          } else {
            row[key] = item[value];
          }
        }
        return row;
      });

      // Debugging: log the final exportData array
      console.log(exportData);
      // 'AR Amount' : {callback:(data)=>{
      //     'doctotalamt' - 'totamount';
      //     return data;
      // }}
    },

    calculatePages() {
      const startPage = Math.max(1, this.dataDistributor.current_page - 1);
      const endPage = Math.min(startPage + 2, this.dataDistributor.last_page);

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
    formatTanggal(angka) {
      var hari = angka.substring(0, 2);
      var bulan = angka.substring(2, 4);
      var tahun = angka.substring(4, 8);
      var tanggal = hari + "-" + bulan + "-" + tahun;
      return tanggal;
    },
  },
};
</script>
<style>
.cell {
  text-align: center;
  vertical-align: middle;
  padding: 3px;
}
</style>
