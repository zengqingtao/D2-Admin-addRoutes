<template>
  <div style="display:inline-block">
    <!-- <select-districts ref="selectDistricts"
              v-model="districts_id"
              :hasHospital="1"
              :hasMedicine="hasMedicine"
              :hasGeneral="hasGeneral"
              :hasNurse="hasNurse"
              :containNurse="containNurse"
              :containDoctor="containDoctor"
              :hasDoctor="hasDoctor"
              :hasAttendance="hasAttendance"
              :type="type"
    ></select-districts> -->
    <el-cascader placeholder="请选择所属地区" :options="districtOptions" v-model="districts_id"></el-cascader>
    <el-select v-model="hospital_id" placeholder="选择医院" :style="textWidth">
      <el-option label="请选择" key="" value=""></el-option>
      <el-option :label="v.name" :key="v.id" :value="v.id" v-for="(v,i) in hospitals"></el-option>
    </el-select>
  </div>
</template>
<script>
import { getDistrict, getDistrictHospital, getGeneralOrNurse } from '@/api/orders'
export default {
  props: ['value', 'hasGeneral', 'hasMedicine', 'hasNurse', 'hasDoctor', 'hasAttendance', 'containNurse', 'containDoctor', 'type'],
  data() {
    return {
      districtOptions: [],
      districts_id: [],
      hospital_id: this.value,
      hospitals: [],
      loading: false,
    };
  },
  watch: {
    hospital_id(val) {
      this.$emit('input', val)
    },
    districts_id() {
      this.fetchHospitals()
    },
    hospitals(val) {
      if (this.hospital_id) {
        if (!val.find(i => i.id === this.hospital_id)) {
          this.hospital_id = null
        }
      }
    }
  },
  computed: {
    textWidth() {
      if (this.hospital_id) {
        let name;
        for (let i = 0; i < this.hospitals.length; i++) {
          if (this.hospitals[i].id === this.hospital_id) name = this.hospitals[i].name
        }
        if (name && name.length) return 'min-width: ' + (name.length + 4) + 'em'
      }
      return null
    }
  },
  methods: {
    fetchHospitals(query) {
      this.loading = true
      getDistrictHospital({'district_id': this.districts_id.length == 3 ? this.districts_id[2] : this.districts_id[1] , 'has_general': this.hasGeneral, 'has_nurse': this.hasNurse, 'has_doctor': this.hasDoctor}).then(response => {
        this.hospitals = response.data
        this.$emit('updateHospitals', response.data)
        this.loading = false
      })
    },
    initValue() {
      this.loading = true
      getDistrict({'has_general': this.hasGeneral, 'has_nurse': this.hasNurse, 'has_doctor': this.hasDoctor}).then(response => {
        this.districtOptions = response.data
        this.loading = false
      })
    }
  },
  created() {
    this.initValue()
  }
};
</script>
