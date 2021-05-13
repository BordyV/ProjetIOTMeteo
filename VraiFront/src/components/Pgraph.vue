

<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    valEsp: {},
  },
  mounted() {
    this.renderChart(
      {
        labels: this.getDate(),
        datasets: [
          {
            label: "Data 1",
            data: this.splitList(),
            backgroundColor: "transparent",
            borderColor: "rgba(1, 116, 188, 0.50)",
            pointBackgroundColor: "rgba(171, 71, 188, 1)",
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: Object.keys(this.valEsp[0]),
        },
      }
    );
    console.log(this.valEsp);
  },
  methods: {
    splitList() {
      let res = [];
      for (let index = 0; index < 10; index++) {
        res.push(this.valEsp[index].lumiere);
      }
      return res;
    },
    getDate() {
      let res = [];
      for (let index = 0; index < 10; index++) {
        res.push(this.valEsp[index].date);
      }
      return res;
    },
  },
};
</script>