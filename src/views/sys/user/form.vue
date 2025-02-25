<script setup lang="ts">
import { ref, computed } from "vue";
import { FormProps } from "./utils/types";
import ReCol from "@/components/ReCol";
import ReSegmented from "@/components/ReSegmented";
import { useFormRule } from "./utils/rules";
import { usePublicHooks, genderOptions } from "@/utils/constants";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    roleIds: [],
    roleList: [],
    deptId: undefined,
    deptList: [],
    username: "",
    password: "",
    confirmPassword: "",
    gender: 1,
    nickname: "",
    phone: "",
    email: "",
    enabled: true
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);
const isUpdate = computed(() => !!props.formInline.id);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    label-width="82px"
    :rules="useFormRule(newFormInline)"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户昵称" prop="nickname">
          <el-input
            v-model="newFormInline.nickname"
            clearable
            placeholder="请输入用户昵称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户账号" prop="username">
          <el-input
            v-model="newFormInline.username"
            clearable
            placeholder="请输入用户账号"
            :disabled="!!newFormInline.id"
          />
        </el-form-item>
      </re-col>
      <re-col v-if="!isUpdate" :value="12" :xs="24" :sm="24">
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            clearable
            placeholder="请输入登录密码"
            type="password"
            show-password
          />
        </el-form-item>
      </re-col>
      <re-col v-if="!isUpdate" :value="12" :xs="24" :sm="24">
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="newFormInline.confirmPassword"
            clearable
            placeholder="请再次输入登录密码"
            type="password"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="newFormInline.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="性别" prop="gender">
          <ReSegmented
            v-model="newFormInline.gender"
            :options="genderOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.gender = value;
              }
            "
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="角色列表" prop="ids">
          <el-select
            v-model="newFormInline.roleIds"
            placeholder="请选择"
            class="w-full"
            clearable
            multiple
          >
            <el-option
              v-for="(item, index) in newFormInline.roleList"
              :key="index"
              :value="item.id"
              :label="item.name"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户状态">
          <el-switch
            v-model="newFormInline.enabled"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
