<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格 -->
    <tree-table
      class="treeTable"
      :data="catelist"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="#"
      border
    >
      <template slot="isok" slot-scope="scope">
        <i
          class="el-icon-success"
          v-if="scope.row.cat_deleted === false"
          style="color: lightgreen;"
        ></i>
        <i class="el-icon-error" v-else style="color: red;"></i>
      </template>
      <!-- 排序 -->
      <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
        <el-tag type="warning" size="mini" v-else>三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="opt" slot-scope="scope">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="showEditDialog(scope.row.cat_id)"
        >编辑</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="removeRolesById(scope.row.cat_id)"
        >删除</el-button>
      </template>
    </tree-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="options"
            :props="{ expandTrigger: 'hover',cascaderProps }"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addKate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="80px"
      >
        <!-- <el-form-item label="分类 ID" prop="id">
          <el-input v-model="editCateForm.id"></el-input>
        </el-form-item>-->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 从服务器保存下的数组
      options: [
        // 数组0     -4
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组1      -1
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组2      -9
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组3
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组4      -7
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组5      -6
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组6      -3
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组7       -8
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组8       -5
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组9       -2
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组10
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组11
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组12
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组13       -10
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组14
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组15
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组16
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组17
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        },
        // 数组18
        {
          value: '',
          label: '',
          children: [
            {
              value: '',
              label: ''
            },
            {
              value: '',
              label: ''
            }
          ]
        }
      ],
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认是空
      catelist: [],
      //   总数据条数
      total: 0,
      //   为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 控制修改分类对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的分类信息对象
      editCateForm: {},
      // 修改表单的验证规则对象
      editCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '角色名称的长度在1-10个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取商品分类数据
    async getCateList() {
      const { data: res } = await this.axios.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      console.log(res.data)
      //   把数据列表，赋值给 catelist
      this.catelist = res.data.result
      //   为总数据条数赋值
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenaem改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.axios.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分级分类数据失败！')
      }
      console.log(res.data)
      this.parentCateList = res.data
      // 将从服务器里获取的值存入options数组中
      for (var i = 0; i < 19; i++) {
        this.$set(this.options[i], 'value', this.parentCateList[i].cat_id)
        this.$set(this.options[i], 'label', this.parentCateList[i].cat_name)
        for (var j = 0; j < this.parentCateList[i].children.length; j++) {
          this.$set(
            this.options[i].children[j],
            'label',
            this.parentCateList[i].children[j].cat_name
          )
          this.$set(
            this.options[i].children[j],
            'value',
            this.parentCateList[i].children[j].cat_id
          )
        }
      }
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.options)
      console.log(this.selectedKeys)
      // 如果selectedKeys数组中的length大于0，证明选中的父级分类
      // 反之就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        //  父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys.length - 1
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        //  父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addKate() {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      //   console.log(id)
      const { data: res } = await this.axios.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类信息失败！')
      }
      this.editCateForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClose() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 修改用户信息并提交
    editCateRolesInfo() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.axios.put(
          'categories/' + this.editCateForm.cat_id,
          {
            cat_name: this.editCateForm.cat_name
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getCateList()
        // 提示修改成功
        this.$message.success('更新角色信息成功！')
      })
    },
    // 根据ID删除对应的用户信息
    async removeRolesById(id) {
      // 弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.axios.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
