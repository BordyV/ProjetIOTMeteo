<template>
  <bootstrap-dropdown(:options="options" @select="selected = $event" ) name="input-name"/>
</template>

<script>
import { BootstrapDropdown } from 'vue-custom-google-autocomplete'
export default {
  components: {
    BootstrapDropdown
  },
  data() {
    return {
      selected: null,
      options: any = {
        apiKey: process.env.VUE_APP_PLACE_API_KEY,
        deepSearch: true,
        cors: true,
        focus: false,
        params: {
          location: '45.52345,-122.67621',
          radius: 1000,
          language: 'en'
        }
      }
    }
  }
}
</script>