const PRICE = 9.99;
new Vue({
  el: "#app",
  data() {
    return {
      total: 0,
      items: [],
      cart: [],
      search: "",
      lastSearch: '',
      searching: false,
      price: PRICE
    };
  },
  filters: {
    currency(value) {
      return `$${value.toFixed(2)}`;
    }
  },
  methods: {
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
        
        this.items = [];
        if(this.search.length){
            this.searching=true;
            this.$http
            .get(`/search/${this.search}`)
            .then(({ data }) => {
              console.log(data);
              this.items = data;
              this.lastSearch = this.search;
              this.searching=false;
            });
        }
      
    }
  }
});
