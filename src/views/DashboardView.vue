<template>
  <Pages title="Dashboard">
    <CRow class="mb-3">
      <CCol class="d-flex justify-content-between align-items-center" md="12">
        <div>
          <strong style="font-size: 20px !important">Monitoring {{ !month ? "This Month" : month }}</strong>
        </div>
        <div>
          <CDropdown>
            <CDropdownToggle color="primary">
              <CIcon icon="cil-calendar" width="24" height="24" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem @click="countData('01', 'January')">January</CDropdownItem>
              <CDropdownItem @click="countData('02', 'February')">February</CDropdownItem>
              <CDropdownItem @click="countData('03', 'March')">March</CDropdownItem>
              <CDropdownItem @click="countData('04', 'April')">April</CDropdownItem>
              <CDropdownItem @click="countData('05', 'May')">May</CDropdownItem>
              <CDropdownItem @click="countData('06', 'June')">June</CDropdownItem>
              <CDropdownItem @click="countData('07', 'July')">July</CDropdownItem>
              <CDropdownItem @click="countData('08', 'August')">August</CDropdownItem>
              <CDropdownItem @click="countData('09', 'September')">September</CDropdownItem>
              <CDropdownItem @click="countData('10', 'October')">October</CDropdownItem>
              <CDropdownItem @click="countData('11', 'November')">November</CDropdownItem>
              <CDropdownItem @click="countData('12', 'December')">December</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CCol>
    </CRow>
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
      <CCol md="4">
        <CWidgetStatsF color="primary" title="Total" :value="count.totalBill ? count.totalBill : '0.00'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-money" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
        </CWidgetStatsF>
      </CCol>
      <CCol md="4">
        <CWidgetStatsF color="warning" :title="!month ? 'THIS MONTH' : month" :value="count.totalBillMonth ? count.totalBillMonth : '0.00'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-money" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
        </CWidgetStatsF>
      </CCol>
      <CCol md="4">
        <CWidgetStatsF color="danger" title="Over Due" :value="count.totalBillOver ? count.totalBillOver : '0.00'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-money" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
        </CWidgetStatsF>
      </CCol>
    </CRow>

    <CRow class="mb-3">
      <CCol md="5">
        <CCard>
          <CCardBody>
            <h1>Aging Vendor</h1>
            <CRow>
              <CCol md="7">
                <div>
                  <canvas style="max-height: 33vh" id="agingVendorChart"></canvas>
                </div>
              </CCol>
              <CCol md="5" style="max-height: 33vh; overflow-y: auto">
                <div id="js-legend"></div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md="7">
        <CCard>
          <CCardBody>
            <h1>Aging Year</h1>
            <div>
              <canvas style="max-height: 33vh" id="dept-chart"></canvas>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CRow class="mb-3">
      <CCol md="4">
        <CWidgetStatsF color="primary" title="REQUISITIONS WITH PURCHASE ORDERS" :value="this.count.requisitions ? this.count.requisitions : '0'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-file" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
          <template #footer>
            <strong>{{ this.count.requisitionsAmount ? this.count.requisitionsAmount : "0.00" }}</strong>
          </template>
        </CWidgetStatsF>
      </CCol>
      <CCol md="4">
        <CWidgetStatsF color="primary" title="REQUISITIONS NON PURCHASE ORDERS" :value="this.count.requisitionsNonPO ? this.count.requisitionsNonPO : '0'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-file" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
          <template #footer>
            <strong>{{ this.count.requisitionsNonPOAmount ? this.count.requisitionsNonPOAmount : "0.00" }}</strong>
          </template>
        </CWidgetStatsF>
      </CCol>
      <CCol md="4">
        <CWidgetStatsF color="primary" title="DOWN PAYMENTS" :value="this.count.downPayments ? this.count.downPayments : '0'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-file" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
          <template #footer>
            <strong>{{ this.count.downPaymentsAmount ? this.count.downPaymentsAmount : "0.00" }}</strong>
          </template>
        </CWidgetStatsF>
      </CCol>
    </CRow>

    <CRow class="mb-3">
      <CCol md="4">
        <CWidgetStatsF color="primary" title="PURCHASE ORDERS" :value="this.count.purchaseOrders ? this.count.purchaseOrders : '0'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-file" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
          <template #footer>
            <strong>{{ this.count.purchaseOrdersAmount ? this.count.purchaseOrdersAmount : "0.00" }}</strong>
          </template>
        </CWidgetStatsF>
      </CCol>
      <CCol md="4">
        <CWidgetStatsF color="primary" title="INVOICES" :value="this.count.invoices ? this.count.invoices : '0'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-file" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
          <template #footer>
            <strong>{{ this.count.invoicesAmount ? this.count.invoicesAmount : "0.00" }}</strong>
          </template>
        </CWidgetStatsF>
      </CCol>
      <CCol md="4">
        <CWidgetStatsF color="primary" title="PAYMENT VOUCHERS" :value="this.count.paymentVouchers ? this.count.paymentVouchers : '0'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-file" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
          <template #footer>
            <strong>{{ this.count.paymentVouchersAmount ? this.count.paymentVouchersAmount : "0.00" }}</strong>
          </template>
        </CWidgetStatsF>
      </CCol>
    </CRow>
  </Pages>
</template>

<script>
import Pages from "@/components/template/Pages.vue";
import ApiService from "@/services/api/ap.js";
import Chart from "chart.js/auto";
import numeral from "numeral";

const leftLegendPlugin = {
  id: "leftLegend",
  beforeInit(chart) {
    chart.legend.options.position = "left";
    chart.legend.afterFit = function () {
      this.width = this.width + 100;
    };
  },
};

export default {
  components: {
    Pages,
  },
  mounted() {
    this.countData();
  },
  data() {
    return {
      count: {
        requisitions: null,
        requisitionsNonPO: null,
        downPayments: null,
        purchaseOrders: null,
        invoices: null,
        paymentVouchers: null,
        requisitionsAmount: null,
        requisitionsNonPOAmount: null,
        downPaymentsAmount: null,
        purchaseOrdersAmount: null,
        invoicesAmount: null,
        paymentVouchersAmount: null,
        totalBill: null,
        totalBillMonth: null,
        totalPaidMonth: null,
        totalNotPaidMonth: null,
        totalBillOver: null,
        vendors: null,
        monthlyDebts: [],
      },
      myChart: {
        agingVendor: null,
        agingYear: null,
      },
      spinner: false,
      alert: {
        visible: false,
        title: null,
        message: null,
        color: "danger",
      },
      month: null,
    };
  },
  methods: {
    formatAmount(number) {
      return numeral(number).format("0,0.00");
    },
    agingVendorChart(vendorData) {
      vendorData.sort((a, b) => b.invoices_sum_doctotalamtr - a.invoices_sum_doctotalamtr);

      const chartData = {
        labels: vendorData.map((vendor) => vendor.vendname),
        datasets: [
          {
            label: "Hutang per Vendor",
            backgroundColor: vendorData.map(
              () =>
                "#" +
                Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, "0")
            ),
            data: vendorData.map((vendor) => vendor.invoices_sum_doctotalamtr),
          },
        ],
      };

      const canvas = document.getElementById("agingVendorChart");
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        console.error("Unable to get context for 'agingVendorChart'");
        return;
      }

      if (this.myChart?.agingVendor) {
        this.myChart.agingVendor.destroy();
      }

      this.myChart = this.myChart || {};
      this.myChart.agingVendor = new Chart(ctx, {
        type: "doughnut",
        data: chartData,
        options: {
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  let label = context.label ? context.label + " : " : "";
                  if (context.raw !== null) label += parseFloat(context.raw).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  return label;
                },
              },
            },
          },
        },
        plugins: [
          {
            id: "customLegend",
            afterUpdate: (chart) => {
              const legendContainer = document.getElementById("js-legend");
              if (!legendContainer) {
                console.error("Element 'js-legend' not found!");
                return;
              }
              const ul = document.createElement("ul");
              ul.style.listStyle = "none";
              ul.style.padding = 0;

              const labels = chartData.labels;
              labels.forEach((label, index) => {
                const li = document.createElement("li");
                li.style.display = "flex";
                li.style.alignItems = "center";
                li.style.cursor = "pointer";
                li.style.marginBottom = "4px";
                li.style.fontSize = "10px";
                li.onclick = () => {
                  const meta = chart.getDatasetMeta(0);
                  const item = meta.data[index];
                  item.hidden = !item.hidden;
                  chart.update();
                  li.style.textDecoration = item.hidden ? "line-through" : "none";
                  boxSpan.style.backgroundColor = item.hidden ? "#ccc" : label.fillStyle;
                };
                const boxSpan = document.createElement("span");
                boxSpan.style.backgroundColor = chartData.datasets[0].backgroundColor[index];
                boxSpan.style.width = "12px";
                boxSpan.style.height = "12px";
                boxSpan.style.display = "inline-block";
                boxSpan.style.marginRight = "8px";
                li.appendChild(boxSpan);
                li.appendChild(document.createTextNode(label));
                li.style.textDecoration = chart.getDatasetMeta(0).data[index].hidden ? "line-through" : "none";
                ul.appendChild(li);
              });
              legendContainer.innerHTML = "";
              legendContainer.appendChild(ul);
            },
          },
        ],
      });
    },

    agingYearChart() {
      const months = this.count.monthlyDebts.map((item) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthNames[item.month - 1];
      });

      const totalDebts = this.count.monthlyDebts.map((item) => item.totalDebt);
      const totalPaid = this.count.monthlyDebts.map((item) => item.totalPaid);

      const canvas = document.getElementById("dept-chart");
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        console.error("Unable to get context for 'dept-chart'");
        return;
      }

      if (this.myChart?.agingYear) {
        this.myChart.agingYear.destroy();
      }

      const formatter = new Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 });

      this.myChart.agingYear = new Chart(ctx, {
        type: "line",
        data: {
          labels: months,
          datasets: [
            {
              label: "Total Debt",
              borderColor: "rgb(255, 99, 132)",
              data: totalDebts,
            },
            {
              label: "Total Paid",
              borderColor: "rgb(54, 162, 235)",
              data: totalPaid,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: false },
            tooltip: {
              enabled: true,
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label ? context.dataset.label + ": " : "";
                  if (context.parsed.y !== null) label += formatter.format(context.parsed.y);
                  return label;
                },
              },
            },
            legend: {
              labels: {
                generateLabels: (chart) => {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.datasets.map((dataset, i) => ({
                      text: dataset.label,
                      fillStyle: dataset.borderColor,
                      hidden: chart.getDatasetMeta(i).hidden,
                      lineCap: "round",
                      lineDash: [],
                      lineDashOffset: 0,
                      lineJoin: "round",
                      lineWidth: 3,
                      strokeStyle: dataset.borderColor,
                    }));
                  } else {
                    return [];
                  }
                },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                callback: (value) => formatter.format(value),
              },
            },
          },
        },
      });
    },

    async countData(month = "00", monthChar) {
      try {
        this.alert.visible = false;
        this.spinner = true;

        const response = await ApiService.countData(month);

        this.count.monthlyDebts = response.aging.monthlyDebts;
        this.count.requisitions = response.requisitions.reqWithPO;
        this.count.requisitionsNonPO = response.requisitions.reqNonPO;
        this.count.downPayments = response.requisitions.downPayments;
        this.count.purchaseOrders = response.purchaseOrders.paymentOrderCount;
        this.count.invoices = response.invoices.invoiceCount;
        this.count.paymentVouchers = response.paymentVouchers.paymentVoucherCount;
        this.count.totalBill = this.formatAmount(response.aging.totalBill);
        this.count.totalBillMonth = this.formatAmount(response.aging.totalBillByMonth);
        this.count.totalPaidMonth = response.aging.totalPaidByMonth;
        this.count.totalNotPaidMonth = response.aging.totalNotPaidByMonth;
        this.count.vendors = response.aging.vendors;
        this.count.totalBillOver = this.formatAmount(response.aging.totalBillOverDue);
        this.count.requisitionsAmount = this.formatAmount(response.requisitions.reqWithPOAmount);
        this.count.requisitionsNonPOAmount = this.formatAmount(response.requisitions.reqNonPOAmount);
        this.count.downPaymentsAmount = this.formatAmount(response.requisitions.downPaymentsAmount);
        this.count.purchaseOrdersAmount = this.formatAmount(response.purchaseOrders.paymentOrderSum);
        this.count.invoicesAmount = this.formatAmount(response.invoices.invoiceSum);
        this.count.paymentVouchersAmount = this.formatAmount(response.paymentVouchers.paymentVoucherSum);
        this.month = monthChar;
        this.agingVendorChart(this.count.vendors);
        this.agingYearChart();
      } catch (error) {
        this.getAlert("danger", "Error!", error.message);
        console.error("Error fetching data:", error);
      } finally {
        this.spinner = false;
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
