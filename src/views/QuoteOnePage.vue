<template>
  <div class="container">
    <div class="w-100 mt-3">
      <b-button
        variant="outline-primary"
        @click="
          $router.push({
            name: 'home',
          })
        "
      >
        Назад
      </b-button>
    </div>
    <b-card class="mt-2" bg-variant="secondary" text-variant="white">
      <div class="d-flex flex-column">
        <div class="p-2 text-block">
          <span class="title">ID цитаты: </span>
          <span class="ml-1 text">{{ quoute.id }}</span>
        </div>
        <div class="p-2 text-block">
          <span class="title">Дата создания: </span>
          <span class="ml-1 text">
            {{ new Date(quoute.created_date).toLocaleString() }}
          </span>
        </div>
        <div class="p-2 text-block">
          <span class="title">Редактирование цитаты: </span>
          <span class="ml-1 text">
            {{
              quoute.created_date !== quoute.update_date
                ? new Date(quoute.created_date).toLocaleString()
                : "Редактирования небыло"
            }}
          </span>
        </div>
        <div class="p-2 text-block">
          <span class="title">Автор: </span>
          <span class="ml-1 text">{{ quoute.author }}</span>
        </div>
        <div class="p-2 text-block">
          <span class="title">Жанр: </span>
          <span class="ml-1 text">{{ quoute.genre }}</span>
        </div>
        <div class="p-2 text-block flex-column">
          <span class="title">Текст</span>
          <span>{{ quoute.text_content }}</span>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "QuotePage",
  data() {
    return {
      quoute: {},
    };
  },
  methods: {},
  mounted() {
    if (this.$route.params.id) {
      console.log(this.$store.getters.getQuoteById(this.$route.params.id));
      this.quoute = this.$store.getters.getQuoteById(this.$route.params.id);
    }
  },
};
</script>
<style lang="scss" scoped>
.text-block {
  display: flex;
  .title {
    font-weight: bold;
  }
  .text {
    margin: 0 0 0 5px;
  }
}
</style>
