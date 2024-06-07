<template>
  <Pages :title="title">
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Payable Monitoring</strong>
      </CCardHeader>
      <CCardBody>
        <CAlert
          class="d-flex align-items-center"
          :color="alert.color"
          :visible="alert.visible"
          dismissible
          @close="
            () => {
              alert.visible = false;
            }
          "
        >
          <CIcon v-if="alert.color == 'warning'" icon="cil-warning" class="flex-shrink-0 me-2" width="24" height="24" />
          <CIcon v-if="alert.color == 'success'" icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />
          <CIcon v-if="alert.color == 'danger'" icon="cil-x-circle" class="flex-shrink-0 me-2" width="24" height="24" />
          <div>
            <strong>{{ alert.title }}</strong> {{ alert.message }}
          </div>
        </CAlert>
        <CRow>
          <CCol md="12" class="mb-3">
            <CInputGroup>
              <CInputGroupText id="mySecondary">Data</CInputGroupText>
              <CFormSelect v-model="filter.perPage">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
              </CFormSelect>
              <CInputGroupText id="mySecondary">Type</CInputGroupText>
              <CFormSelect v-model="filter.type">
                <option value="all">All</option>
                <option value="pp">PP</option>
                <option value="ppnpo">PP non PO</option>
                <option value="um">UM</option>
              </CFormSelect>
              <CInputGroupText id="mySecondary">Step</CInputGroupText>
              <CFormSelect v-model="filter.step" :disabled="filter.status !== 'all'">
                <option value="all">All</option>
                <option value="pp">PP</option>
                <option v-if="filter.type == 'pp'" value="po">PO</option>
                <option value="inv">Invoice</option>
                <option value="pv">Payment</option>
              </CFormSelect>
              <CInputGroupText id="mySecondary">Status</CInputGroupText>
              <CFormSelect v-model="filter.status" @change="handleStatusChange()">
                <option value="all">All</option>
                <option value="proccess">Proccess</option>
                <option value="finish">Finish</option>
              </CFormSelect>
              <CInputGroupText id="mySecondary">Date Start</CInputGroupText>
              <CFormInput v-model="filter.dateStart" type="date" />
              <CInputGroupText id="mySecondary">Date End</CInputGroupText>
              <CFormInput v-model="filter.dateEnd" type="date" />
              <CButton v-c-tooltip="{ content: 'Filter data', placement: 'top' }" type="button" color="secondary" variant="outline" @click="getData()">
                <CIcon icon="cil-filter" width="24" height="24" />
              </CButton>
              <CButton v-c-tooltip="{ content: 'Export to excel', placement: 'top' }" type="button" color="secondary" variant="outline" @click="exportData()">
                <CIcon icon="cil-save" width="24" height="24" />
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
        <CRow>
          <CCol md="12" class="mb-3">
            <CInputGroup>
              <CFormInput v-model="keyword" placeholder="Search..." @keydown.enter="searchData()" />
              <CButton v-c-tooltip="{ content: 'Search data', placement: 'top' }" type="button" color="secondary" variant="outline" @click="searchData()">
                <CIcon icon="cil-search" width="24" height="24" />
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
        <div style="width: 100%; overflow: auto">
          <table v-if="monitoring.data && monitoring.total > 0" class="table table-hover table-bordered table-striped table-sm">
            <thead class="align-middle text-center table-secondary">
              <tr>
                <th rowspan="2">#</th>
                <th colspan="4">PP</th>
                <th colspan="4">PO</th>
                <th colspan="2">Invoice</th>
                <th colspan="2">Payment</th>
              </tr>
              <tr>
                <th>Date</th>
                <th>Number</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Date</th>
                <th>Number</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody class="align-middle">
              <tr v-for="(mnt, idx) in filteredData" :key="mnt.id">
                <td>{{ (monitoring.current_page - 1) * monitoring.per_page + idx + 1 }}</td>
                <td class="text-center">{{ formatDate(mnt.RequisitionDate) }}</td>
                <td>{{ mnt.RequisitionNo }}</td>
                <td>{{ formatAmount(mnt.TotalCatery) }}</td>
                <td class="text-center">
                  <CButtonGroup>
                    <CButton v-c-tooltip="{ content: 'Detail PP', placement: 'top' }" color="success" @click="showDetail(mnt.RequisitionNo, 'pp')">
                      <CIcon icon="cil-description" width="20" height="20" />
                    </CButton>
                    <CButton v-c-tooltip="{ content: 'Export to excel', placement: 'top' }" color="secondary" @click="exportDetailData(mnt.RequisitionNo)">
                      <CIcon icon="cil-save" width="20" height="20" />
                    </CButton>
                  </CButtonGroup>
                </td>
                <td class="text-center" v-if="mnt.RequisitionCatery == 1 && mnt.po_no">
                  {{ formatDate(mnt.tgl_buat) }}
                </td>
                <td v-if="mnt.RequisitionCatery == 1 && mnt.po_no">
                  {{ mnt.po_no }}
                </td>
                <td v-if="mnt.RequisitionCatery == 1 && mnt.po_no">
                  {{ formatAmount(mnt.total_po) }}
                </td>
                <td class="text-center" v-if="mnt.RequisitionCatery == 1 && mnt.po_no">
                  <CButton v-c-tooltip="{ content: 'Detail PO', placement: 'top' }" color="success" @click="showDetail(mnt.RequisitionNo, 'po')">
                    <CIcon icon="cil-description" width="20" height="20" />
                  </CButton>
                </td>
                <td class="text-center" v-if="mnt.RequisitionCatery == 1 && !mnt.po_no" colspan="4">
                  <CButton v-c-tooltip="{ content: 'Detail PO on proccess', placement: 'top' }" type="button" color="warning" @click="getAlert('warning', 'Warning!', 'Purchase order on proccess.')">
                    <CIcon icon="cib-safari" width="20" height="20" />
                  </CButton>
                </td>
                <td class="text-center" v-if="mnt.RequisitionCatery == 4" colspan="4">
                  <CButton v-c-tooltip="{ content: 'Detail PO not found', placement: 'top' }" type="button" color="danger" @click="getAlert('warning', 'Warning!', 'Purchase order not found.')">
                    <CIcon icon="cil-x-circle" width="20" height="20" />
                  </CButton>
                </td>
                <td v-if="mnt.doctotalamt">
                  {{ formatAmount(mnt.doctotalamt) }}
                </td>
                <td class="text-center" v-if="mnt.doctotalamt">
                  <CButton
                    v-c-tooltip="{
                      content: mnt.swpaid == 0 ? (isNyicil(mnt.paytotalamt, mnt.swpaid) ? 'Partial invoice has been paid' : 'No invoice has been paid') : 'Invoice already paid',
                      placement: 'top',
                    }"
                    type="button"
                    :color="mnt.swpaid == 0 ? (isNyicil(mnt.paytotalamt, mnt.swpaid) ? 'info' : 'primary') : 'success'"
                    @click="showDetail(mnt.RequisitionNo, 'inv')"
                  >
                    <CIcon icon="cil-description" width="20" height="20" />
                  </CButton>
                </td>
                <td class="text-center" v-if="!mnt.doctotalamt" colspan="2">
                  <CButton v-c-tooltip="{ content: 'Detail Invoice on proccess', placement: 'top' }" type="button" color="warning" @click="getAlert('warning', 'Warning!', 'Invoice on proccess.')">
                    <CIcon icon="cib-safari" width="20" height="20" />
                  </CButton>
                </td>
                <td v-if="mnt.totamount">
                  {{ formatAmount(mnt.totamount) }}
                </td>
                <td class="text-center" v-if="mnt.totamount">
                  <CButton v-c-tooltip="{ content: 'Detail Payment Voucher available', placement: 'top' }" type="button" color="success" @click="showDetail(mnt.RequisitionNo, 'pv')">
                    <CIcon icon="cil-description" width="20" height="20" />
                  </CButton>
                </td>
                <td class="text-center" v-if="!mnt.totamount" colspan="2">
                  <CButton v-c-tooltip="{ content: 'Detail Payment Voucher on proccess', placement: 'top' }" type="button" color="warning" @click="getAlert('warning', 'Warning!', 'Payment Voucher on proccess.')">
                    <CIcon icon="cib-safari" width="20" height="20" />
                  </CButton>
                </td>
              </tr>
            </tbody>

            <tfoot class="text-center table-secondary">
              <tr>
                <th rowspan="2">#</th>
                <th>Date</th>
                <th>Number</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Date</th>
                <th>Number</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
              <tr>
                <th colspan="4">PP</th>
                <th colspan="4">PO</th>
                <th colspan="2">Invoice</th>
                <th colspan="2">Payment</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <nav v-if="monitoring.data && calculatePages().length > 1" class="mt-2">
          <CButtonGroup role="group">
            <CButton type="button" color="secondary" variant="outline" :disabled="monitoring.current_page === 1" @click="getData(monitoring.current_page - 1)">&#60;</CButton>
            <template v-for="page in calculatePages()">
              <CButton type="button" color="secondary" variant="outline" @click="getData(page)" :class="{ active: page === monitoring.current_page }">{{ page }}</CButton>
            </template>
            <CButton type="button" color="secondary" variant="outline" :disabled="monitoring.current_page === monitoring.last_page" @click="getData(monitoring.current_page + 1)">&#62;</CButton>
          </CButtonGroup>
        </nav>
      </CCardBody>
    </CCard>
  </Pages>
  <CModal
    alignment="center"
    size="xl"
    backdrop="static"
    :visible="detail.visible"
    @close="
      () => {
        detail.visible = false;
      }
    "
  >
    <CModalHeader>
      <CModalTitle v-if="detail.step == 'pp'">Detail PP</CModalTitle>
      <CModalTitle v-if="detail.step == 'po'">Detail PO</CModalTitle>
      <CModalTitle v-if="detail.step == 'inv'">Detail Invoice</CModalTitle>
      <CModalTitle v-if="detail.step == 'pv'">Detail Payment Voucher</CModalTitle>
    </CModalHeader>
    <CModalBody v-if="detail.data">
      <div v-if="detail.step == 'pp'">
        <CRow class="mb-2">
          <CCol md="5">
            <CFormInput type="text" floatingLabel="Nomer PP" :value="detail.data[0].RequisitionNo" disabled />
          </CCol>
          <CCol md="3">
            <CFormInput type="text" floatingLabel="Tanggal PP" :value="formatDate(detail.data[0].RequisitionDate)" disabled />
          </CCol>
          <CCol md="4">
            <CFormInput type="text" floatingLabel="Total Amount" :value="formatAmount(detail.data[0].TotalCatery)" disabled />
          </CCol>
        </CRow>
        <CRow class="mb-2">
          <CCol>
            <CFormInput type="text" floatingLabel="User" :value="detail.data[0].e_p_r_s_users.cbisms_user_fullname" disabled />
          </CCol>
        </CRow>
        <table class="table table-hover table-bordered table-sm mt-3">
          <thead class="text-center">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Sub Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mnt, idx) in detail.data[0].requisition_detail" :key="mnt.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ mnt.ReqDtlName }}</td>
              <td>{{ mnt.ReqDtlQty }}</td>
              <td>{{ formatAmount(mnt.ReqDtlAmount) }}</td>
              <td>{{ formatAmount(mnt.ReqDtlTotal) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="detail.step == 'po'">
        <CRow class="mb-2">
          <CCol md="6">
            <CFormInput class="mb-2" type="text" floatingLabel="Nomer PP" :value="detail.reqNo" disabled />
          </CCol>
          <CCol md="6">
            <CFormInput class="mb-2" type="text" floatingLabel="Nilai PO" :value="formatAmount(detail.data.totalMax)" disabled />
          </CCol>
        </CRow>
        <div style="max-width: 100%; overflow: auto">
          <table class="table table-hover table-bordered table-sm mt-3">
            <thead class="text-center">
              <tr>
                <th>#</th>
                <th>Nomer</th>
                <th>Nilai</th>
                <th>Nama PP</th>
                <th>Tanggal</th>
                <th>Vendor</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mnt, idx) in detail.data.data" :key="mnt.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ mnt.po_no }}</td>
                <td>{{ formatAmount(mnt.qty * mnt.harga) }}</td>
                <td>{{ mnt.nama_pp }}</td>
                <td class="text-center">{{ formatDate(mnt.tgl_buat) }}</td>
                <td>{{ mnt.vendor_id }}</td>
                <td>{{ mnt.comments }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="detail.step == 'inv'">
        <CRow>
          <CCol md="6">
            <CFormInput class="mb-2" type="text" floatingLabel="Nomer PP" :value="detail.reqNo" disabled />
          </CCol>
          <CCol md="6">
            <CFormInput class="mb-2" type="text" floatingLabel="Nilai Invoice" :value="formatAmount(detail.data.amount)" disabled />
          </CCol>
        </CRow>
        <div style="width: 100%; overflow: auto">
          <table class="table table-hover table-bordered table-sm mt-3">
            <thead class="text-center">
              <tr>
                <th>#</th>
                <th>Doc. No</th>
                <th>Doc. Date</th>
                <th>Due Date</th>
                <th>Vendor</th>
                <th>Bill</th>
                <th>Unpaid</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Description</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mnt, idx) in detail.data.list" :key="mnt.id" class="align-middle">
                <td>{{ idx + 1 }}</td>
                <td>{{ mnt.docnum }}</td>
                <td class="text-center">{{ formatDate(mnt.docdate) }}</td>
                <td>{{ formatDate(mnt.docduedate) }}</td>
                <td>{{ mnt.vendname }}</td>
                <td>{{ formatAmount(mnt.doctotalamt) }}</td>
                <td>{{ formatAmount(mnt.doctotalamtr) }}</td>
                <td>{{ formatAmount(mnt.paytotalamt) }}</td>
                <td>{{ mnt.swpaid == 1 ? "Finish" : "Proccess" }}</td>
                <th>{{ mnt.invdesc }}</th>
                <th>{{ mnt.audituser }}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="detail.step == 'pv'">
        <CRow>
          <CCol md="6">
            <CFormInput class="mb-2" type="text" floatingLabel="Nomer PP" :value="detail.reqNo" disabled />
          </CCol>
          <CCol md="6">
            <CFormInput class="mb-2" type="text" floatingLabel="Nilai Payment Voucher" :value="formatAmount(detail.data.amount)" disabled />
          </CCol>
        </CRow>
        <div style="width: 100%; overflow: auto">
          <table class="table table-hover table-bordered table-sm mt-3">
            <thead class="text-center">
              <tr>
                <th>#</th>
                <th>Number Invoice</th>
                <th>Number Payment</th>
                <th>Batch Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mnt, idx) in detail.data.list" :key="mnt.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ mnt.docnum }}</td>
                <td>{{ mnt.reference }}</td>
                <td class="text-center">{{ formatDate(mnt.batchdate) }}</td>
                <td>{{ mnt.dscription }}</td>
                <td>{{ formatAmount(mnt.totamount) }}</td>
                <td>{{ mnt.audituser }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CModalBody>
  </CModal>
</template>

<style>
.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}

.table th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#mySecondary {
  background-color: rgb(226, 227, 229);
  color: rgb(0, 0, 0);
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 9999px inset;
}
</style>

<script>
import Pages from "@/components/template/Pages.vue";
import ApiService from "@/services/api/ap.js";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import numeral from "numeral";

export default {
  components: {
    Pages,
  },
  computed: {
    filteredData() {
      if (!this.keyword || this.keyword.trim() === "") {
        return this.monitoring.data;
      }

      const filtered = this.monitoring.data.filter((item) => {
        if (item && item.RequisitionNo) {
          return item.RequisitionNo.toLowerCase().includes(this.keyword.toLowerCase());
        }
        return false;
      });

      if (filtered.length === 0) {
        this.getAlert("warning", "Failed!", "Data not found on this page or invalid keyword.");
      }

      return filtered;
    },
  },
  data() {
    return {
      title: "A/P MONITORING",
      alert: {
        visible: false,
        title: null,
        message: null,
        color: "danger",
      },
      detail: {
        visible: false,
        data: [],
        step: null,
        reqNo: null,
      },
      excel: null,
      visibleExcel: false,
      keyword: null,
      filter: {
        perPage: "50",
        status: "all",
        step: "all",
        type: "all",
        dateStart: null,
        dateEnd: null,
      },
      monitoring: {
        data: null,
        current_page: 1,
        last_page: 1,
        per_page: 100,
        prev_page_url: null,
        next_page_url: null,
      },
    };
  },
  methods: {
    formatAmount(number) {
      return numeral(number).format("0,0.00");
    },
    isNyicil(paytotalamt, swpaid) {
      if (paytotalamt != 0 && swpaid == 0) {
        return true;
      } else {
        return false;
      }
    },
    formatDate(data) {
      return format(new Date(data), "dd-MM-yyyy");
    },
    async getData(page = 1) {
      try {
        this.alert.visible = false;
        this.$root.loader = true;

        if (this.filter.dateEnd && !this.filter.dateStart) {
          this.getAlert("danger", "Error!", "Please fill all form.");
          return;
        } else if (!this.filter.dateEnd && this.filter.dateStart) {
          this.getAlert("danger", "Error!", "Please fill all form.");
          return;
        } else if (this.filter.dateEnd && this.filter.dateStart) {
          if (this.filter.dateEnd < this.filter.dateStart) {
            this.getAlert("danger", "Error!", "End date should be greater than start date.");
            return;
          }
        }

        const data = await ApiService.getDataMnt(page, this.filter);
        this.monitoring = data;
        this.getAlert("success", "Success!", `Success with ${this.monitoring.total} data.`);
      } catch (error) {
        this.getAlert("danger", "Error!", error.message);
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async searchData() {
      try {
        this.alert.visible = false;
        if (!this.keyword) {
          this.getAlert("danger", "Error!", "Please fill form.");
          return;
        } else {
          this.$root.loader = true;
          const data = await ApiService.searchData(this.filter.perPage, this.keyword);
          this.monitoring = data;

          if (this.monitoring.total > 0) {
            this.getAlert("success", "Success!", `Success with ${this.monitoring.total} data.`);
          } else {
            this.getAlert("warning", "Failed!", `Data not found or invalid keyword.`);
          }
        }
      } catch (error) {
        this.getAlert("danger", "Error!", "Data not found.");
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async showDetail(code, step) {
      try {
        this.alert.visible = false;
        this.$root.loader = true;

        const data = await ApiService.getDetailData(code, step);
        this.detail.data = data;
        this.detail.step = step;
        this.detail.reqNo = code;
        this.detail.visible = true;
      } catch (error) {
        this.getAlert("danger", "Error!", "Data not found.");
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async exportData() {
      try {
        this.alert.visible = false;

        if (!this.filter.dateEnd || !this.filter.dateStart) {
          this.getAlert("danger", "Error!", "Please fill all form.");
          return;
        } else if (this.filter.dateEnd && this.filter.dateStart) {
          if (this.filter.dateEnd < this.filter.dateStart) {
            this.getAlert("danger", "Error!", "End date should be greater than start date.");
            return;
          }
        }

        this.$root.loader = true;

        const data = await ApiService.exportData(this.filter);
        this.excel = data;

        const jsonDataWithoutColumns = this.excel.map((item) => {
          const { RequisitionNo, RequisitionCatery, ...rest } = item;
          return rest;
        });

        const ws = XLSX.utils.json_to_sheet(jsonDataWithoutColumns);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        XLSX.writeFile(wb, "monitoring.xls");
      } catch (error) {
        this.getAlert("danger", "Error!", "Data not found.");
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async exportDetailData(code) {
      try {
        this.alert.visible = false;
        this.$root.loader = true;

        const data = await ApiService.exportDetailData(code);
        this.excel = data;

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        XLSX.writeFile(wb, code + ".xls");
      } catch (error) {
        this.getAlert("danger", "Error!", "Data not found.");
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    handleStatusChange() {
      if (this.filter.status !== "all") {
        this.filter.step = "all";
      }
      this.filter.type = "pp";
    },

    handleTypeChange() {
      this.filter.step = "all";
    },

    calculatePages() {
      const startPage = Math.max(1, this.monitoring.current_page - 4);
      const endPage = Math.min(startPage + 8, this.monitoring.last_page);

      return Array.from(
        {
          length: endPage - startPage + 1,
        },
        (_, i) => startPage + i
      );
    },

    getAlert(color, title, message) {
      this.alert.title = title;
      this.alert.color = color;
      this.alert.message = message;
      this.alert.visible = true;

      this.scrollToTop();
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>
