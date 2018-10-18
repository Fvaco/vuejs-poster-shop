const PRICE = 9.99;
const LOAD_NUM = 10;
new Vue({
  el: "#app",
  data() {
    return {
      total: 0,
      items: [],
      results: [],
      cart: [],
      search: "",
      lastSearch: "",
      searching: false,
      price: PRICE
    };
  },
  filters: {
    currency(value) {
      return `$${value.toFixed(2)}`;
    }
  },
  computed: {
    noMoreItems() {
      return this.results.length && this.items.length >= this.results.length;
    }
  },
  methods: {
    appendItems() {
      if (this.results.length) {
        if (this.items.length < this.results.length) {
          this.items = this.items.concat(
            this.results.slice(this.items.length, this.items.length + LOAD_NUM)
          );
        }
      }
    },

    addItem(index) {
      this.total += PRICE;
      let { id, title } = this.items[index];
      let foundIndex = this.cart.findIndex(itemCart => itemCart.id === id);

      if (foundIndex > -1) return this.cart[foundIndex].qty++;

      this.cart.push({
        id,
        title,
        qty: 1,
        price: PRICE
      });
    },
    increment(item) {
      item.qty++;
      this.total += PRICE;
    },
    decrement(item) {
      item.qty--;
      this.total -= PRICE;
      if (item.qty === 0) {
        this.cart.splice(
          this.cart.findIndex(element => element.id === item.id),
          1
        );
      }
    },
    onSubmit() {
      if (this.search.length) {
        this.items = [];
        this.searching = true;
        this.$http.get(`/search/${this.search}`).then(({ data }) => {
          this.results = data;
          this.items = this.results.slice(0, LOAD_NUM);
          this.lastSearch = this.search;
          this.searching = false;
        });
      }
    }
  },
  mounted() {
    const elem = document.getElementById("product-list-bottom");
    const watcher = scrollMonitor.create(elem);
    watcher.enterViewport(() => {
      this.appendItems();
    });
  }
});
