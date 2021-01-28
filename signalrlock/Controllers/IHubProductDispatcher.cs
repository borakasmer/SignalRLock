using System.Threading.Tasks;

namespace signalrlock.Controllers
{
    public interface IHubProductDispatcher
    {
        Task PushProduct(Product product,string connectionID,bool isCancel = true);
    }
}