<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <div class="freet-labels" v-if="freet.freetType == 'merchant'">
      <img class="freet-icons" :src="`images/${freet.freetType}.png`" alt="">
      <p>Merchant Freet</p>
    </div>

    <div class="freet-labels" v-if="freet.freetType == 'fleeting'">
        <img style="margin-right: 4px;" class="freet-icons" :src="`images/${freet.freetType}.png`" alt="">
        <p>Fleeting Freet</p>
    </div>

    <div class="freet-sections">
      <div class="freet-image">
        <img class="profile-image" src="images/profile-images/profile-5.png" alt="">
      </div>
    
    <div class="freet-content">
      <header>
      <div class="freet-author">
        <h2>{{ freet.name }}</h2>
        <h3 class="author"> @{{ freet.author }}</h3>
        <h3>•</h3>
        <h3 class="info"> {{ freet.dateModified }}
        <i v-if="freet.edited">(edited)</i>
        </h3>
      </div>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    </header>

    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <div
      v-else
      class="content"
    >      
    <p>{{ freet.content }}</p>
  </div>

    <div v-if="editing && freet.freetType == 'fleeting'" >
            <label :for="expiration">Expiration:</label>
            <input type="datetime-local" 
            :id="expiration" 
            :name="expiration"
            :value="newExpiration"
            @input="newExpiration = $event.target.value">
            <p>{{newExpiration}}</p>
    </div>

      <p v-if="freet.freetType == 'merchant'">
        <!-- {{freet.merchantFreet[0]}} -->
        <MerchantComponent
          :key="freet.id"
          :freet="freet"
          :merchantFreet="freet.merchantFreet[0]"
        />

      </p>
    </div>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </div>
  </article>
</template>

<script>
import MerchantComponent from '@/components/Freet/MerchantComponent.vue';

export default {
  name: 'FreetComponent',
  components: {MerchantComponent},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content,
      newExpiration: this.freet.expiration, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft && this.freet.freetType != 'fleeting') {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft, expiration: this.newExpiration}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
h2 {
  /* //styleName: Headings/Desktop/H5; */
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;
}
h3 {
  /* //styleName: Body/Regular/3; */
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;
  color: #69696B;
}

textarea {
  font-family: 'Manrope';

  border: 2px solid #E1E1E6;
  width: 100%;
  border-radius: 12px;
  /* height: 124px; */
  padding: 12px;
  margin-top: 16px;

  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0em;
}
.content p {
  margin: 8px 0px 8px 0px;
}
.freet {
  border-top: 0.5px solid #D5D5DE;
  padding: 20px;
  position: relative;
}
.freet-icons {
  width: 20px;
  height: 20px;
}

.freet-labels {
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: #69696B;
  margin-bottom: 12px !important;
}

.freet-labels, .freet-author {
  display: flex;
  align-items: center;
}

.freet-author * {
  padding-right: 8px;
  margin: 0px 0px;
}

.freet-labels p {
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  margin: 0px;
}

.profile-image {
  width: 48px;
  height: 48px;
  margin-right: 12px;
}

.freet-sections {
  display: flex;
}

.freet-content {
  width: 100%;
}

button {
  border-radius: 8px;
  border: none;
  margin-right: 8px;
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
