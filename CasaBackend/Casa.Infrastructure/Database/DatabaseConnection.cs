namespace CasaBackend.Casa.Infrastructure.Database
{
	public class DatabaseConnection(IConfiguration configuration, string connectionName = "CasaDB")
	{
		public string? ConnectionString { get; } = configuration.GetConnectionString(connectionName)
				?? throw new InvalidOperationException($"Connection string '{connectionName}' not found.");
	}
}
