using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.Common;

namespace CasaBackend.Casa.Infrastructure.Database
{
    public class SQLServer : IDatabase
    {
		public DatabaseConnection DbConnection { get; set; }
		private readonly SqlConnection sqlConnection;

		public SQLServer(DatabaseConnection dbConnection)
		{
			this.DbConnection = dbConnection;
			sqlConnection = new SqlConnection(DbConnection.ConnectionString);
		}
		public async Task OpenConnectionAsync()
		{
			if (sqlConnection.State == ConnectionState.Open) { return; }
			await sqlConnection.OpenAsync();
		}
		public async Task CloseConnectionAsync()
		{
			if (sqlConnection.State == ConnectionState.Closed) { return; }
			await sqlConnection.CloseAsync();
		}
		public async Task<DataTable> ExecuteQueryAsync(string query, params DbParameter[] parameters)
		{
			await OpenConnectionAsync();
			using (var cmd = new SqlCommand(query, sqlConnection))
			{
				AddParameters(cmd, parameters);
				using (var reader = cmd.ExecuteReaderAsync())
				{
					DataTable dt = new DataTable();
					dt.Load(reader.Result);
					await CloseConnectionAsync();
					return dt;
				}
			}
		}
		public async Task<int> ExecuteNonQueryAsync(string query, params DbParameter[] parameters)
		{
			await OpenConnectionAsync();
			using (var cmd = new SqlCommand(query, sqlConnection))
			{
				AddParameters(cmd, parameters);
				int result = await cmd.ExecuteNonQueryAsync();
				await CloseConnectionAsync();
				return result;
			}
		}
		public void AddParameters(SqlCommand cmd, params DbParameter[] parameters)
		{
			foreach (DbParameter param in parameters)
			{
				cmd.Parameters.Add(new SqlParameter(param.ParameterName, param.Value));
			}
		}
	}
}
