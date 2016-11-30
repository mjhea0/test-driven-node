exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('products').del()
  .then(() => {
    return Promise.all([
      // Inserts seed entries
      knex('products').insert({
        name: 'Licensed Wooden Computer',
        description: 'Eligendi est dolore iusto est eos laborum. Ipsam iste excepturi quam aliquid aliquam esse omnis consectetur in. Ut officiis nostrum totam sit veritatis saepe qui omnis. Et cumque impedit architecto esse vero.',
        price: 31.00
      }),
      knex('products').insert({
        name: 'Handmade Concrete Soap',
        description: 'Doloremque ipsam perferendis praesentium minima. Et ratione ut sint aliquid recusandae quos repudiandae dicta. Harum placeat beatae dolorum placeat. Necessitatibus suscipit magnam consequuntur officia porro fugiat quia odio. Cupiditate ipsa qui quibusdam laborum.',
        price: 72.00
      }),
      knex('products').insert({
        name: 'Incredible Frozen Gloves',
        description: 'Accusamus aliquam eligendi vero sit. Quidem hic inventore eos dignissimos quae totam autem eaque ratione. Quo veniam sit qui voluptas nisi fugiat beatae. Minima impedit numquam consectetur eius facere quas molestiae accusamus laudantium. Non qui voluptatem.',
        price: 68.98
      })
    ]);
  });
};
