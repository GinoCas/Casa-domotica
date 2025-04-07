using CasaBackend.Casa.Infrastructure.Database;

namespace CasaBackend.Casa.Core.Interfaces
{
	public interface IService<TInput, TOutput>
	{
		public IDatabase Database { get; }
	}
}
