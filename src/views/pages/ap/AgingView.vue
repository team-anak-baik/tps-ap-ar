<template>
  <Pages :title="title">
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Payable Aging</strong>
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
        <CRow class="mb-3">
          <CCol>
            <CInputGroup>
              <CInputGroupText id="mySecondary">Type</CInputGroupText>
              <CFormSelect v-model="filter.type">
                <option value="summary">Summary</option>
                <option value="detail">Detail</option>
              </CFormSelect>
              <CInputGroupText id="mySecondary">Cut Off Aging</CInputGroupText>
              <CFormInput v-model="filter.cutOffDue" type="date" />
              <CButton v-c-tooltip="{ content: 'Filter data', placement: 'top' }" type="button" color="secondary" variant="outline" @click="getData()">
                <CIcon icon="cil-filter" width="24" height="24" />
              </CButton>
              <CButton v-if="filter.type === 'detail' && invoices && invoices.vendors" v-c-tooltip="{ content: 'Export to excel', placement: 'top' }" type="button" color="secondary" variant="outline" @click="exportDetailToXLS()">
                <CIcon icon="cil-save" width="24" height="24" />
              </CButton>
              <CButton v-if="filter.type === 'summary' && invoices && invoices.vendors" v-c-tooltip="{ content: 'Export to excel', placement: 'top' }" type="button" color="secondary" variant="outline" @click="exportSummaryToXLS()">
                <CIcon icon="cil-save" width="24" height="24" />
              </CButton>
              <CButton v-if="filter.type === 'detail' && invoices && !invoices.vendors" v-c-tooltip="{ content: 'Export to excel', placement: 'top' }" type="button" color="secondary" variant="outline" @click="getAlert('warning', 'Error!', 'Please get data first.')">
                <CIcon icon="cil-save" width="24" height="24" />
              </CButton>
              <CButton v-if="filter.type === 'summary' && invoices && !invoices.vendors" v-c-tooltip="{ content: 'Export to excel', placement: 'top' }" type="button" color="secondary" variant="outline" @click="getAlert('warning', 'Error!', 'Please get data first.')">
                <CIcon icon="cil-save" width="24" height="24" />
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
        <CRow v-if="filter.type === 'summary'">
          <CCol md="12" class="mb-3">
            <CInputGroup>
              <CFormInput v-model="keyword" placeholder="Search..." />
              <CButton v-c-tooltip="{ content: 'Search data', placement: 'top' }" type="button" color="secondary" variant="outline">
                <CIcon icon="cil-search" width="24" height="24" />
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
        <div v-if="filter.type == 'summary'">
          <table v-if="invoices && invoices.vendors" class="table table-hover table-striped table-bordered table-sm text-center align-middle">
            <thead class="table-secondary">
              <tr>
                <th>#</th>
                <th>Vendor Code</th>
                <th>Vendor</th>
                <th>Current</th>
                <th>After</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-start">
              <tr v-for="(mnt, idx) in filteredData">
                <td>
                  {{ idx + 1 }}
                </td>
                <td>
                  {{ mnt.vendor.vendcode }}
                </td>
                <td>
                  {{ mnt.vendor.vendname }}
                </td>
                <td>
                  {{ formatAmount(mnt.vendor.current) }}
                </td>
                <td>
                  {{ formatAmount(mnt.vendor.after) }}
                </td>
                <td>
                  {{ formatAmount(mnt.vendor.total) }}
                </td>
                <td class="text-center">
                  <CButtonGroup>
                    <CButton v-c-tooltip="{ content: 'Detail aging', placement: 'top' }" color="success" size="sm" @click="getDetail(mnt.vendor.vendcode)">
                      <CIcon icon="cil-description" width="20" height="20" />
                    </CButton>
                    <CButton v-c-tooltip="{ content: 'Export to excel', placement: 'top' }" color="secondary" size="sm" @click="exportInvoicesToXLS(mnt.vendor.vendcode)">
                      <CIcon icon="cil-save" width="20" height="20" />
                    </CButton>
                  </CButtonGroup>
                </td>
              </tr>
            </tbody>
            <tfoot class="text-start">
              <tr>
                <td class="text-center" colspan="3"><strong>Total</strong></td>
                <td>
                  <strong>{{ formatAmount(invoices.current) }}</strong>
                </td>
                <td>
                  <strong>{{ formatAmount(invoices.after) }}</strong>
                </td>
                <td colspan="2">
                  <strong>
                    {{ formatAmount(invoices.total) }}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
          <table v-if="invoices && invoices.vendors" hidden class="table-summary">
            <thead>
              <tr>
                <th>#</th>
                <th>Vendor Code</th>
                <th>Vendor</th>
                <th>Current</th>
                <th>After</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mnt, idx) in invoices.vendors">
                <td>
                  {{ idx + 1 }}
                </td>
                <td>
                  {{ mnt.vendor.vendcode }}
                </td>
                <td>
                  {{ mnt.vendor.vendname }}
                </td>
                <td>
                  {{ formatAmount(mnt.vendor.current) }}
                </td>
                <td>
                  {{ formatAmount(mnt.vendor.after) }}
                </td>
                <td>
                  {{ formatAmount(mnt.vendor.total) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">Total</td>
                <td>
                  {{ formatAmount(invoices.current) }}
                </td>
                <td>
                  {{ formatAmount(invoices.after) }}
                </td>
                <td>
                  {{ formatAmount(invoices.total) }}
                </td>
              </tr>
            </tfoot>
          </table>
          <table v-if="invoice && invoice.vendor" hidden class="table-invoices">
            <tbody>
              <tr>
                <th>Vendor Code</th>
                <th>Vendor</th>
                <th>Doc. Num.</th>
                <th>Doc. Date</th>
                <th>Due. Date</th>
                <th>Current</th>
                <th>After</th>
                <th>Total Pay</th>
              </tr>
              <tr v-for="inv in invoice?.vendor.invoices.current">
                <td>{{ invoice?.vendor.vendcode }}</td>
                <td>{{ invoice?.vendor.vendname }}</td>
                <td>{{ inv.docnum }}</td>
                <td>{{ formatDate(inv.docdate) }}</td>
                <td>{{ formatDate(inv.docduedate) }}</td>
                <td>{{ formatAmount(inv.doctotalamtr) }}</td>
                <td>0.00</td>
                <td>{{ formatAmount(inv.doctotalamtr) }}</td>
              </tr>
              <tr v-for="inv in invoice?.vendor.invoices.after">
                <td>{{ invoice?.vendor.vendcode }}</td>
                <td>{{ invoice?.vendor.vendname }}</td>
                <td>{{ inv.docnum }}</td>
                <td>{{ formatDate(inv.docdate) }}</td>
                <td>{{ formatDate(inv.docduedate) }}</td>
                <td>0.00</td>
                <td>{{ formatAmount(inv.doctotalamtr) }}</td>
                <td>{{ formatAmount(inv.doctotalamtr) }}</td>
              </tr>
              <tr>
                <td colspan="5">Sub. Total</td>
                <td>
                  {{ formatAmount(invoice?.vendor.current) }}
                </td>
                <td>
                  {{ formatAmount(invoice?.vendor.after) }}
                </td>
                <td>
                  {{ formatAmount(invoice?.vendor.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filter.type == 'detail'">
          <table v-if="invoices && invoices.vendors" class="table table-hover table-striped table-bordered table-sm text-start align-middle">
            <tbody v-for="(mnt, idx) in invoices.vendors">
              <tr class="text-center table-danger">
                <th><strong>Vendor Num.</strong></th>
                <th><strong>Vendor Name</strong></th>
                <th><strong>Doc. Num.</strong></th>
                <th><strong>Doc. Date</strong></th>
                <th><strong>Due. Date</strong></th>
                <th><strong>Current</strong></th>
                <th><strong>After</strong></th>
                <th><strong>Total</strong></th>
              </tr>
              <tr v-for="invoice in mnt.vendor.invoices.current">
                <td>{{ mnt.vendor.vendcode }}</td>
                <td>{{ mnt.vendor.vendname }}</td>
                <td>{{ invoice.docnum }}</td>
                <td>{{ formatDate(invoice.docdate) }}</td>
                <td>{{ formatDate(invoice.docduedate) }}</td>
                <td>{{ formatAmount(invoice.doctotalamtr) }}</td>
                <td>0.00</td>
                <td>{{ formatAmount(invoice.doctotalamtr) }}</td>
              </tr>
              <tr v-for="invoice in mnt.vendor.invoices.after">
                <td>{{ mnt.vendor.vendcode }}</td>
                <td>{{ mnt.vendor.vendname }}</td>
                <td>{{ invoice.docnum }}</td>
                <td>{{ formatDate(invoice.docdate) }}</td>
                <td>{{ formatDate(invoice.docduedate) }}</td>
                <td>0.00</td>
                <td>{{ formatAmount(invoice.doctotalamtr) }}</td>
                <td>{{ formatAmount(invoice.doctotalamtr) }}</td>
              </tr>
              <tr>
                <td class="text-center" colspan="5"><strong>Sub. Total</strong></td>
                <td>
                  <strong>{{ formatAmount(mnt.vendor.current) }}</strong>
                </td>
                <td>
                  <strong>{{ formatAmount(mnt.vendor.after) }}</strong>
                </td>
                <td>
                  <strong>{{ formatAmount(mnt.vendor.total) }}</strong>
                </td>
              </tr>
            </tbody>

            <tfoot class="align-middle">
              <tr>
                <td class="text-center" colspan="5"><strong>Total</strong></td>
                <td>
                  <strong>{{ formatAmount(invoices.current) }}</strong>
                </td>
                <td>
                  <strong>{{ formatAmount(invoices.after) }}</strong>
                </td>
                <td>
                  <strong>{{ formatAmount(invoices.total) }}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
          <table v-if="invoices && invoices.vendors" hidden class="table-detail">
            <tbody v-for="(mnt, idx) in invoices.vendors">
              <tr>
                <th>Vendor Num.</th>
                <th>Vendor Name</th>
                <th>Doc. Num.</th>
                <th>Doc. Date</th>
                <th>Due. Date</th>
                <th>Current</th>
                <th>After</th>
                <th>Total</th>
              </tr>
              <tr v-for="invoice in mnt.vendor.invoices.current">
                <td>{{ mnt.vendor.vendcode }}</td>
                <td>{{ mnt.vendor.vendname }}</td>
                <td>{{ invoice.docnum }}</td>
                <td>{{ formatDate(invoice.docdate) }}</td>
                <td>{{ formatDate(invoice.docduedate) }}</td>
                <td>{{ formatAmount(invoice.doctotalamtr) }}</td>
                <td>0.00</td>
                <td>{{ formatAmount(invoice.doctotalamtr) }}</td>
              </tr>
              <tr v-for="invoice in mnt.vendor.invoices.after">
                <td>{{ mnt.vendor.vendcode }}</td>
                <td>{{ mnt.vendor.vendname }}</td>
                <td>{{ invoice.docnum }}</td>
                <td>{{ formatDate(invoice.docdate) }}</td>
                <td>{{ formatDate(invoice.docduedate) }}</td>
                <td>0.00</td>
                <td>{{ formatAmount(invoice.doctotalamtr) }}</td>
                <td>{{ formatAmount(invoice.doctotalamtr) }}</td>
              </tr>
              <tr>
                <td colspan="5">Sub. Total</td>
                <td>
                  {{ formatAmount(mnt.vendor.current) }}
                </td>
                <td>
                  {{ formatAmount(mnt.vendor.after) }}
                </td>
                <td>
                  {{ formatAmount(mnt.vendor.total) }}
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td colspan="5">Total</td>
                <td>
                  {{ formatAmount(invoices.current) }}
                </td>
                <td>
                  {{ formatAmount(invoices.after) }}
                </td>
                <td>
                  {{ formatAmount(invoices.total) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CCardBody>
    </CCard>
  </Pages>
  <CModal
    alignment="center"
    fullscreen
    backdrop="static"
    :visible="modalInvoice.visible"
    @close="
      () => {
        modalInvoice.visible = false;
      }
    "
  >
    <CModalHeader v-if="invoice && invoice.vendor">
      <CModalTitle>{{ invoice?.vendor.vendcode }} | {{ invoice?.vendor.vendname }} </CModalTitle>
    </CModalHeader>
    <CModalBody>
      <table class="table table-hover table-striped table-bordered table-sm text-start align-middle">
        <tbody>
          <tr class="text-center table-danger">
            <th><strong>Doc. Num.</strong></th>
            <th><strong>Doc. Date</strong></th>
            <th><strong>Due. Date</strong></th>
            <th><strong>Current</strong></th>
            <th><strong>After</strong></th>
            <th><strong>Total Pay</strong></th>
          </tr>
          <tr v-for="inv in invoice?.vendor.invoices.current">
            <td>{{ inv.docnum }}</td>
            <td>{{ formatDate(inv.docdate) }}</td>
            <td>{{ formatDate(inv.docduedate) }}</td>
            <td>{{ formatAmount(inv.doctotalamtr) }}</td>
            <td>0.00</td>
            <td>{{ formatAmount(inv.doctotalamtr) }}</td>
          </tr>
          <tr v-for="inv in invoice?.vendor.invoices.after">
            <td>{{ inv.docnum }}</td>
            <td>{{ formatDate(inv.docdate) }}</td>
            <td>{{ formatDate(inv.docduedate) }}</td>
            <td>0.00</td>
            <td>{{ formatAmount(inv.doctotalamtr) }}</td>
            <td>{{ formatAmount(inv.doctotalamtr) }}</td>
          </tr>
          <tr>
            <td class="text-center" colspan="3"><strong>Sub. Total</strong></td>
            <td>
              <strong>{{ formatAmount(invoice?.vendor.current) }}</strong>
            </td>
            <td>
              <strong>{{ formatAmount(invoice?.vendor.after) }}</strong>
            </td>
            <td>
              <strong>{{ formatAmount(invoice?.vendor.total) }}</strong>
            </td>
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
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
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
import numeral from "numeral";
import { format } from "date-fns";

export default {
  components: {
    Pages,
  },
  computed: {
    filteredData() {
      if (!this.keyword || this.keyword.trim() === "") {
        return this.invoices.vendors;
      }

      const filtered = this.invoices.vendors.filter((item) => {
        if (item && (item.vendname || item.vendcode)) {
          const vendorName = item.vendname ? item.vendname.toLowerCase() : "";
          const vendorCode = item.vendcode ? item.vendcode.toLowerCase() : "";
          return vendorName.includes(this.keyword.toLowerCase()) || vendorCode.includes(this.keyword.toLowerCase());
        }
        return false;
      });

      if (filtered.length === 0) {
        this.getAlert("warning", "Failed!", "Data not found or invalid keyword.");
      }

      return filtered;
    },
  },

  data() {
    return {
      title: "A/P AGING",
      alert: {
        visible: false,
        title: null,
        message: null,
      },
      keyword: null,
      filter: {
        cutOffDue: null,
        type: "summary",
      },
      modalInvoice: {
        visible: false,
      },
      invoices: [],
      invoice: [],
    };
  },
  methods: {
    formatDate(data) {
      return format(new Date(data), "dd-MM-yyyy");
    },
    formatAmount(number) {
      if (number < 0) {
        number = Math.abs(number);
      }
      return numeral(number).format("0,0.00");
    },
    exportSummaryToXLS() {
      try {
        this.$root.loader = true;
        const tables = document.querySelector(".table-summary");
        const wb = XLSX.utils.table_to_book(tables, {
          sheet: "Sheet JS",
          bookType: "xls",
        });
        XLSX.writeFile(wb, "aging-summary.xls");
      } catch (error) {
        this.getAlert("danger", "Error!", error.message);
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    exportDetailToXLS() {
      try {
        this.$root.loader = true;
        const tables = document.querySelector(".table-detail");
        const wb = XLSX.utils.table_to_book(tables, {
          sheet: "Sheet JS",
          bookType: "xls",
        });
        XLSX.writeFile(wb, "aging-detail.xls");
      } catch (error) {
        this.getAlert("danger", "Error!", error.message);
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    async exportInvoicesToXLS(vendorNumber) {
      try {
        await this.getDetail(vendorNumber, true);
        const tables = document.querySelector(".table-invoices");
        const wb = XLSX.utils.table_to_book(tables, {
          sheet: "Sheet JS",
          bookType: "xls",
        });
        XLSX.writeFile(wb, "aging-invoices.xls");
      } catch (error) {
        this.getAlert("danger", "Error!", error.message);
        console.error("Error fetching data:", error);
      }
    },

    async getData() {
      try {
        this.alert.visible = false;
        this.$root.loader = true;
        const data = await ApiService.getDataAg(this.filter);
        this.invoices = data;
      } catch (error) {
        this.getAlert("danger", "Error!", error.message);
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
    },
    async getDetail(code, exportData = false) {
      try {
        this.alert.visible = false;
        this.$root.loader = true;
        const data = await ApiService.getDetail(code, this.filter);
        this.invoice = data;
        if (!exportData) {
          this.modalInvoice.visible = true;
        }
      } catch (error) {
        this.getAlert("danger", "Error!", error.message);
        console.error("Error fetching data:", error);
      } finally {
        this.$root.loader = false;
      }
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
