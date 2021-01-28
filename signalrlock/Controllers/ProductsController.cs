using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
namespace signalrlock.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        public static Dictionary<string, List<Product>> ProductDB = new();
        public static List<Product> Products = new();
        private static readonly string[] ProductList = new[]
        {
            "Macbook16 Pro", "Bose Q35", "PS5", "PS4", "Xbox", "GoPro", "Magic_Keyboard", "MX_Anywhere", "Dell_P2715Q", "IPhone 12 PRO"
        };

        IHubProductDispatcher _dispatcher;
        public ProductsController(IHubProductDispatcher dispatcher)
        {
            _dispatcher = dispatcher;
        }

        [HttpGet("{connectionID}")]
        public List<Product> Get(string connectionID)
        {
            var rng = new Random();
            Products = Enumerable.Range(1, 10).Select(index => new Product
            {
                ID = index,
                Name = ProductList[rng.Next(ProductList.Length)],
                Price = rng.Next(1000) + 500,
                CreatedDate = DateTime.Now
            }).GroupBy(item => item.Name)
                   .Select(grp => grp.First()).Take(5)
                   .ToList();
            ProductDB.Add(connectionID, Products);
            return Products;
        }

        [HttpGet("GetProductByName/{name}/{connectionID}")]
        public async Task<Product> GetProductByName(string name, string connectionID)
        {
            if (ProductDB.TryGetValue(connectionID, out List<Product> _Products))
            {
                Product product = _Products.First(pr => pr.Name == name);
                await _dispatcher.PushProduct(product, connectionID);
                return product;
            }
            return new Product();
        }
        [HttpPost("UpdateProduct/{connectionID}")]
        public async Task UpdateProduct([FromBody] Product product, string connectionID)
        {

            if (product != null)
            {
                ProductDB.ToList().ForEach(proList => proList.Value.ForEach(pro =>
                {
                    pro.Price = pro.Name == product.Name ? product.Price : pro.Price;
                }));
                await _dispatcher.PushProduct(product, connectionID, false);
            }
        }
    }
    public class LockerHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("GetConnectionId", this.Context.ConnectionId);
        }

        public async Task ClearProduct(Product product)
        {
            await Clients.Others.SendAsync("PushProduct", product, false);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            ProductsController.ProductDB.Remove(this.Context.ConnectionId);
            Console.WriteLine("DisconnectID:" + this.Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
