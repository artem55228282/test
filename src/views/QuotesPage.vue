<template>
  <div class="wrapper">
    <div class="container">
      <div class="w-100 button-wrapper">
        <b-button variant="outline-primary" class="mb-2">
          <b-icon icon="clipboard-plus" font-scale="1"></b-icon> Добавить цитату
        </b-button>
      </div>
      <b-card bg-variant="secondary" text-variant="white">
        <div>
          <div class="card-top">
            <span class="author"> Artem </span>
            <span class="created-date"> 22.11.2022 </span>
          </div>
          <div class="card-middle">
            <span class="content">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus, blanditiis?
            </span>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: "",
    };
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
    align-items: center;
    .author {
      font-weight: bold;
      color: #d5d0d0;
    }
  }
  .card-middle {
    width: 100%;
  }
  .button-wrapper {
    display: flex;
    justify-content: end;
    align-items: center;
  }
}
</style>
