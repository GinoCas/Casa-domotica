using CasaAPI.DBContext.Room;
using CasaAPI.Models;
using CasaAPI.Utils.Responses;

namespace CasaAPI.Handlers.Room
{
	public class GetHandler
	{
		private readonly RoomDB context;
		public GetHandler(RoomDB roomDB)
		{
			context = roomDB;
		}
		public Response<RoomModel> GetRoomByName(string roomName)
		{
			Response<RoomModel> response = new Response<RoomModel>();
			RoomModel? room = context.GetByName(roomName);
			if (room == null)
			{
				response.cdRes = "ERROR";
				response.dsRes = "Habitacion inexistente";
				response.errors.Add(response.dsRes);
				return response;
			}
			response.data.Add(room);
			return response;
		}
		public Response<string> GetRoomNameList()
		{
			Response<string> response = new Response<string>();
			response.data = context.GetNameList();
			return response;
		}
	}
}
