<template>
  <div class="img-container">
    <el-upload v-if="max == 1"
      :action="uploadHost"
      list-type="avatar-uploader"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="handleBefore"
      :show-file-list="false">
      <img v-if="files.length > 0" :src="files[0].url" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-upload  v-if="max > 1"
      :action="uploadHost"
      list-type="picture-card"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="handleBefore"
      :limit="max"
      :file-list="files">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
export default {
  name: 'uploadimg',
  props: ['max', 'filelist'],
  data() {
    return {
      uploadHost: '',
      files: (this.filelist == undefined ? [] : this.filelist),
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  watch: {
    files (val) {
      if (val.length > 0) {
        if (this.max == 1) {
          this.$emit('input', val[0].url)
        } else {
          var tmp = []
          val.forEach(i => {
            tmp.push(i.url)
          })
          this.$emit('input', tmp)
        }
      }
    }
  },
  methods: {
    setFile (val) {
      this.files = val
    },
    handleSuccess (file) {
      if (this.max == 1) {
        this.files = []
      }
      this.files.push(file.data)
    },
    handleRemove(file) {
      var index = this.files.findIndex(i => {
        return i == file.url
      })
      this.files.splice(index, 1)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleBefore (file) {
      // 超过200k不给上传
      if (parseInt(file.size / 1024) > 200) {
        Message.error('请上传小于200kb的文件')
        return false
      } else {
        return true
      }
    }
  },
  mounted () {
    this.uploadHost = process.env.VUE_APP_UPLOAD_IMG_URL
  }
}
</script>
<style>
.el-upload--picture-card,.el-upload-list--picture-card .el-upload-list__item{
  width: 70px;
  height: 70px;
  line-height: 68px;
}
.el-upload .avatar-uploader-icon{
  width: 70px;
  height: 70px;
  line-height: 68px; 
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
