<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <input
      v-model="value"
      type="text"
      :placeholder="placeholder"
    >
    <button
      type="submit"
    >
      {{ button }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
export default {
  name: 'InlineForm',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: 'Submit'
    }
  },
  data() {
    return {value: '', alerts: {}};
  }
};
</script>

<style scoped>
form {
    display: flex;
    position: relative;
}

input {
    padding: 0 5px;
    min-width: 200px;
    min-height: 38px;
    border: 2px solid #E1E1E6;
    border-radius: 8px;
    font-family: 'Manrope';
}

button {
  border-radius: 8px;
  border: none;
  margin-left: 8px;
  padding: 4px 12px;
  font-family: 'Manrope';
  font-weight: 500;

  transition: background 0.2s ease;
  transition: .2s ease-out;
}

button:hover {
  background: #D5D5DE;
}
</style>
