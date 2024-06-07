<template>
  <Pages title="Dashboard">
    <!-- <CCard class="mb-3"> -->
    <!-- <CCardHeader class="d-flex justify-content-between align-items-center">
        <div>Aging AR</div>
        <div>
          <CDropdown>
            <CDropdownToggle color="primary">
              <CIcon icon="cil-calendar" width="24" height="24" />
            </CDropdownToggle>
            <CDropdownMenu v-model="monthSelect">
              <template v-for="(month, index) in months" :key="index">
                <CDropdownItem @click="selectMonth(index + 1, month.value)">{{ month.label }} </CDropdownItem>
              </template>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CCardHeader>
      <CCardBody> -->

    <CRow class="mb-3">
      <CCol class="d-flex justify-content-between align-items-center" md="12">
        <div>
          <strong style="font-size: 20px !important">Monitoring {{ !monthSelect ? "This Month" : monthSelect }}</strong>
        </div>
        <div>
          <CDropdown>
            <CDropdownToggle color="primary">
              <CIcon icon="cil-calendar" width="24" height="24" />
            </CDropdownToggle>
            <CDropdownMenu v-model="monthSelect">
              <template v-for="(month, index) in months" :key="index">
                <CDropdownItem @click="selectMonth(index + 1, month.value)">{{ month.label }} </CDropdownItem>
              </template>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CCol md="4">
        <CWidgetStatsF color="primary" title="Total" :value="`Rp${count.totalBill ? formatCurrencyIdr(count.totalBill) : '0'}`">
          <template #icon>
            <CIcon icon="cil-money" width="24" height="24" />
          </template>
        </CWidgetStatsF>
      </CCol>
      <CCol md="4">
        <CWidgetStatsF color="warning" :title="monthSelect" :value="`Rp${count.totalBillMonth ? formatCurrencyIdr(count.totalBillMonth) : '0'}`">
          <template #icon>
            <CIcon icon="cil-money" width="24" height="24" />
          </template>
        </CWidgetStatsF>
      </CCol>
      <CCol md="4">
        <CWidgetStatsF color="danger" title="Over Due" :value="`Rp${count.totalBillOver ? formatCurrencyIdr(count.totalBillOver) : '0'}`">
          <template #icon>
            <CIcon icon="cil-money" width="24" height="24" />
          </template>
        </CWidgetStatsF>
      </CCol>
    </CRow>
    <!-- </CCardBody>
    </CCard> -->

    <CRow class="mb-3">
      <CCol md="5">
        <CCard>
          <CCardBody>
            <h5>Aging Customer</h5>
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
            <h5>Aging Year</h5>
            <div>
              <canvas style="max-height: 33vh" id="dept-chart"></canvas>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CRow class="mb-3">
      <CCol md="3">
        <CWidgetStatsF color="primary" title="Purchase Order" :value="countDataDistributor && countDataDistributor.po ? countDataDistributor.po : '0'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-file" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
          <template #footer>
            <strong>-</strong>
          </template>
        </CWidgetStatsF>
      </CCol>

      <CCol md="3">
        <CWidgetStatsF color="primary" title="Delivery Order" :value="countDataDistributor && countDataDistributor.do ? countDataDistributor.do : '0'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-file" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
          <template #footer>
            <strong>-</strong>
          </template>
        </CWidgetStatsF>
      </CCol>

      <CCol md="3">
        <CWidgetStatsF color="primary" title="Invoice" :value="countDataDistributor && countDataDistributor.inv ? countDataDistributor.inv : '0'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-file" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
          <template #footer>
            <strong>{{ `Rp${countDataDistributor && countDataDistributor.invamt[0].invamt > 0 ? formatCurrencyIdr(countDataDistributor.invamt[0].invamt) : "0"}` }}</strong>
          </template>
        </CWidgetStatsF>
      </CCol>

      <CCol md="3">
        <CWidgetStatsF color="primary" title="Receipt Vouchers" :value="countDataDistributor && countDataDistributor.rv ? countDataDistributor.rv : '0'">
          <template #icon>
            <CIcon v-if="!spinner" icon="cil-file" width="24" height="24" />
            <CSpinner v-if="spinner" variant="grow" />
          </template>
          <template #footer>
            <strong>{{ `Rp${countDataDistributor && countDataDistributor.rvamt[0].rvamt > 0 ? formatCurrencyIdr(countDataDistributor.rvamt[0].rvamt) : "0"}` }}</strong>
          </template>
        </CWidgetStatsF>
      </CCol>
    </CRow>
    <CRow class="mb-3">
      <CCol md="3">
        <CWidgetStatsF color="primary" title="Sales" :value="`Rp${formatCurrencyIdr(countDataToko)}`">
          <template #icon>
            <CIcon icon="cil-file" width="24" height="24" />
          </template>
        </CWidgetStatsF>
      </CCol>
    </CRow>
  </Pages>
</template>

<script>
import Pages from "@/components/template/Pages.vue";
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  components: {
    Pages,
  },
  async mounted() {
    const today = new Date();
    const currentMonthIndex = today.getMonth();
    const currentMonth = this.months[currentMonthIndex];

    this.monthSelect = currentMonth.label;

    this.userid = 1;
    await this.countData(currentMonthIndex + 1);
  },
  data() {
    return {
      countDataToko: 0,
      countDataDistributor: 0,

      count: {
        totalBill: null,
        totalBillMonth: null,
        totalPaidMonth: null,
        totalNotPaidMonth: null,
        totalBillOver: null,
        customers: null,
        monthlyDebts: [],
      },

      // countDataAging: [],
      // customerData: [],
      // countMonthAg: [],
      // countTotalAg: [],
      // countOverAg: [],

      userid: "",
      monthSelect: null,
      myChart: {
        agingVendor: null,
        agingYear: null,
      },

      months: [
        {
          label: "January",
          value: "Januari",
        },
        {
          label: "February",
          value: "Februari",
        },
        {
          label: "March",
          value: "Maret",
        },
        {
          label: "April",
          value: "April",
        },
        {
          label: "May",
          value: "Mai",
        },
        {
          label: "June",
          value: "Juni",
        },
        {
          label: "July",
          value: "Juli",
        },
        {
          label: "August",
          value: "August",
        },
        {
          label: "September",
          value: "September",
        },
        {
          label: "October",
          value: "Oktober",
        },
        {
          label: "November",
          value: "November",
        },
        {
          label: "December",
          value: "Desember",
        },
      ],
    };
  },
  methods: {
    agingVendorChart(vendorData) {
      vendorData.sort((a, b) => b.invoices_sum_doctotalamtr - a.invoices_sum_doctotalamtr);

      const chartData = {
        labels: vendorData.map((vendor) => vendor.custmrname),
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
              label: "Total AR",
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

    async countData(month = null) {
      try {
        this.$root.loader = true;
        const dataDistributor = await axios.get(`http://localhost:8006/api/countdata`, {
          params: {
            month: month,
            userid: this.userid,
          },
        });
        this.countDataDistributor = dataDistributor.data.data;
        console.log(dataDistributor.data.data);

        // const dataAging = await axios.get(`http://localhost:8006/api/countdata_ag`, {
        //   params: {
        //     month: month,
        //   },
        // });
        // this.customerData = dataAging.data.data.totalAgamt.customer;
        // this.countDataAging = dataAging.data.data.totalAgamt.year;
        // this.countMonthAg = dataAging.data.data.agamttThisMonth.count[0].ar_amt;
        // this.countTotalAg = dataAging.data.data.totalAgamt.count[0].ar_amt;
        // this.countOverAg = dataAging.data.data.totalAgamt.overdue;

        // this.agingYearChart();
        // this.agingVendorChart(this.customerData);

        // console.log(this.countTotalAg);
        // console.log(this.countMonthAg);
        // console.log(this.customerData);
        // console.log(this.countDataAging);
        // console.log(this.countOverAg);

        const dataAging = await axios.get(`http://localhost:8006/api/countdata_ag`, {
          params: {
            month: month,
          },
        });
        this.count.totalBill = dataAging.data.data.aging.totalBill;
        this.count.totalBillMonth = dataAging.data.data.aging.totalBillByMonth;
        this.count.totalPaidMonth = dataAging.data.data.aging.totalPaidByMonth;
        this.count.totalNotPaidMonth = dataAging.data.data.aging.totalNotPaidByMonth;
        this.count.totalBillOver = dataAging.data.data.aging.totalBillOverDue;
        this.count.monthlyDebts = dataAging.data.data.aging.monthlyDebts;
        this.count.customers = dataAging.data.data.aging.customers;
        this.agingVendorChart(this.count.customers);
        this.agingYearChart();

        console.log(dataAging.data);

        const dataToko = await axios.get(`https://ipos-tpsmtg.com:8087/pos/raReportSalesMonth`, {
          params: {
            month_select: month,
          },
        });
        this.countDataToko = dataToko.data[0].get_ra_report_sales_month;
        console.log(dataToko.data[0].get_ra_report_sales_month);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        this.$root.loader = false;
      }
    },

    selectMonth(index, month) {
      this.monthSelect = month;
      this.countData(index);
    },

    formatCurrencyIdr(price) {
      const number = parseFloat(price);
      if (isNaN(number)) {
        return;
      }
      const formattedPrice = number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return formattedPrice;
    },
  },
};
</script>

<style scoped></style>
