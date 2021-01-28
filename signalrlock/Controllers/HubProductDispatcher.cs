using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace signalrlock.Controllers
{
    public class HubProductDispatcher:IHubProductDispatcher
    {
        private readonly IHubContext<LockerHub> _hubContext;
        public HubProductDispatcher(IHubContext<LockerHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task PushProduct(Product product,string connectionID,bool isDisabled = true)
        {
            await this._hubContext.Clients.AllExcept(connectionID).SendAsync("PushProduct", product, isDisabled);
        }
    }
}