using System.Data;
using System.Data.Common;

namespace CasaBackend.Casa.Infrastructure.Database
{
	public interface IDatabase
	{
		public DatabaseConnection DbConnection { get; set; }
		public Task OpenConnectionAsync();
		public Task CloseConnectionAsync();
		public Task<DataTable> ExecuteQueryAsync(string query, params DbParameter[] parameters);
		public Task<int> ExecuteNonQueryAsync(string query, params DbParameter[] parameters);
	}
}
