<template>
  <div class="wrapper">
    <div class="container">
      <div class="w-100 button-wrapper">
        <b-button variant="outline-primary" class="mb-2" @click="addQuotes">
          <b-icon icon="clipboard-plus" font-scale="1"></b-icon> Добавить цитату
        </b-button>
      </div>
      <b-card
        class="mt-2"
        bg-variant="secondary"
        v-for="(quote, idx) in quotes_list"
        :key="idx"
        text-variant="white"
      >
        <div>
          <div class="card-top">
            <div class="card-top-left">
              <span class="author"> {{ quote.author }} </span>
              <span v-if="quote.genre" class="genre">
                {{ "Жанр: " + quote.genre.toString() }}
              </span>
            </div>
            <span class="created-date">
              {{ dateFormatter(quote.created_date) }}
            </span>
          </div>
          <div class="card-middle">
            <div class="row w-100">
              <div class="col-10">
                <span class="content">
                  {{ quote.text_content }}
                </span>
              </div>
              <div class="col-2">
                <span class="button-group">
                  <b-button
                    v-b-tooltip.hover.bottom="'Просмотр'"
                    class="bg-primary p-1 px-2 m-1"
                    style="border-radius: 3px"
                    @click="
                      $router.push({
                        name: 'QuotePage',
                        params: { id: quote.id },
                      })
                    "
                  >
                    <b-icon
                      icon="eye"
                      color="white"
                      size="30px"
                      font-scale="1"
                    ></b-icon>
                  </b-button>
                  <b-button
                    v-b-tooltip.hover.bottom="'Редактировать'"
                    class="bg-warning p-1 px-2 m-1"
                    style="border-radius: 3px"
                    @click="editQuotes(quote)"
                  >
                    <b-icon
                      icon="pencil-square"
                      color="white"
                      size="30px"
                      font-scale="1"
                    ></b-icon>
                  </b-button>
                  <b-button
                    v-b-tooltip.hover.bottom="'Удалить'"
                    class="bg-danger p-1 px-2"
                    style="border-radius: 3px"
                    @click="openDeleteDialog(quote)"
                  >
                    <b-icon
                      icon="basket"
                      color="white"
                      size="30px"
                      font-scale="1"
                    ></b-icon>
                  </b-button>
                </span>
              </div>
            </div>
          </div>
          <div class="card-bottom">
            <span
              v-if="quote.created_date !== quote.update_date"
              class="text-italic"
              >изменено
            </span>
          </div>
        </div>
      </b-card>
    </div>
    <b-modal
      ref="form"
      hide-header-close
      v-model="formDialog"
      button-size="sm"
      :title="bean.id ? 'Редактирование цитаты' : 'Создание цитаты'"
      :ok-title="bean.id ? 'Редактировать' : 'Создать'"
      cancel-title="Отмена"
      hide-footer
      @hide="formDialog = false"
      @show="formDialog = true"
    >
      <b-form ref="form" @submit.prevent.stop="quotesSave(bean)">
        <b-form-group label="Автор" label-for="author-input">
          <b-form-input
            v-model="bean.author"
            @blur="$v.bean.author.$touch()"
            :class="{ 'is-invalid': $v.bean.author.$error }"
            id="name-input"
          >
          </b-form-input>
          <b-form-invalid-feedback v-if="!$v.bean.author.required">
            Обязательное поле
          </b-form-invalid-feedback>

          <b-form-invalid-feedback v-if="!$v.bean.author.alpha">
            Поле должно содержать только буквы
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Жанр">
          <b-form-input
            class="w-100 p-2"
            v-model="bean.genre"
            @blur="$v.bean.genre.$touch()"
            :class="{ 'is-invalid': $v.bean.genre.$error }"
            multiple
            :options="genre_options_arr"
          >
          </b-form-input>
          <b-form-invalid-feedback v-if="!$v.bean.genre.required">
            Обязательное поле
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.bean.genre.alpha">
            Поле должно содержать только буквы
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Текст">
          <b-form-textarea
            @blur="$v.bean.text_content.$touch()"
            :class="{ 'is-invalid': $v.bean.text_content.$error }"
            class="w-100 p-2"
            v-model="bean.text_content"
            style="resize: no-resize"
            rows="3"
          >
          </b-form-textarea>
          <b-form-invalid-feedback v-if="!$v.bean.text_content.required">
            Обязательное поле
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="w-100 form-button-wrapper">
          <span style="display: flex">
            <b-button
              @click="formDialog = false"
              class="p-1 px-2 m-1"
              style="border-radius: 3px"
            >
              Отмена
            </b-button>
            <b-button
              type="submit"
              variant="primary"
              class="bg-primary p-1 px-2 m-1"
              style="border-radius: 3px"
            >
              {{ bean.id ? "Редактировать" : "Создать" }}
            </b-button>
          </span>
        </div>
      </b-form>
    </b-modal>
    <b-modal
      v-model="deleteDialog"
      hide-header
      ok-title="Подтвердить"
      cancel-title="Отмена"
      button-size="xs"
      @ok="deleteQoute"
    >
      <span>Вы действительно хотите удалить цитату?</span>
    </b-modal>
  </div>
</template>

<script>
import { required, helpers } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
const alpha = helpers.regex("alpha", /^[a-zA-Zа-яА-Я]*$/);
const alphaAndSym = helpers.regex("alpha", /^[a-zA-Zа-яА-Я]/);

export default {
  data() {
    return {
      quotes_list: [],
      formDialog: false,
      deleteDialog: false,
      bean: {},
      filter: {
        author: "",
        text_content: "",
      },
      default_bean: {
        id: null,
        author: "",
        created_date: null,
        update_date: null,
        genre: null,
        text_content: "",
      },
    };
  },
  validations: {
    bean: {
      author: {
        required,
        alpha,
      },
      genre: {
        required,
        alpha: alphaAndSym,
      },
      text_content: {
        required,
      },
    },
  },
  methods: {
    ...mapGetters(["getQuotesList"]),
    dateFormatter(milliseconds) {
      let day =
        new Date(milliseconds).getDate() > 10
          ? new Date(milliseconds).getDate()
          : 0 + new Date(milliseconds).getDate();
      let mouth =
        new Date(milliseconds).getMonth() + 1 > 10
          ? new Date(milliseconds).getMonth() + 1
          : 0 + new Date(milliseconds).getMonth() + 1;
      let year = new Date(milliseconds).getFullYear();
      return day + "." + mouth + "." + year;
    },
    addQuotes() {
      this.bean = Object.assign({}, this.default_bean);
      this.formDialog = true;
    },
    editQuotes(row) {
      for (let key in row) {
        this.$set(this.bean, key, row[key]);
      }
      this.bean = JSON.parse(JSON.stringify(row));
      this.formDialog = true;
    },
    openDeleteDialog(row) {
      this.bean = JSON.parse(JSON.stringify(row));
      this.deleteDialog = true;
    },
    deleteQoute() {
      this.$store.commit("deleteQuote", this.bean);
    },
    quotesSave() {
      if (!this.bean.id) {
        console.log(this.bean, " BEAN ");
        this.bean.id = this.quotes_list.length + 1;
        this.bean.created_date = new Date().getTime();
        this.bean.update_date = new Date().getTime();
        this.$store.commit("addQuote", this.bean);
        // this.addQuote(this.bean);
      } else {
        this.bean.update_date = new Date().getTime();
        this.$store.commit("updateQuote", this.bean);
      }
    },
  },
  mounted() {
    this.quotes_list = this.getQuotesList();
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  margin-top: 15px;
  .card-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .card-top-left {
      display: flex;
      flex-direction: column;
      .author {
        font-weight: bold;
        color: #d5d0d0;
      }
      .genre {
        margin-top: 5px;
        color: rgb(220, 209, 209);
      }
    }
  }
  .card-middle {
    margin-top: 15px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .button-group {
      display: flex;
      justify-content: end;
      align-items: center;
    }
  }
  .card-bottom {
    width: 100%;
    display: flex;
    justify-content: end;
    font-style: italic;
    color: rgb(203, 216, 216);
  }
  .button-wrapper {
    display: flex;
    justify-content: end;
    align-items: center;
  }
}
.form-button-wrapper {
  padding: 15px 0 0;
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
}
</style>
