import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    extends: Line,
    mixins: [reactiveProp],
    props: ['options'],
    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: Object.keys(this.valEsp[0]),
                },
            },
        }
    },
    mounted() {
        // this.chartData is created in the mixin.
        // If you want to pass options please create a local options object
        this.renderChart(this.chartData, this.options)
    }
}
