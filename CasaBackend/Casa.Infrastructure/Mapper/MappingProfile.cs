using AutoMapper;
using CasaBackend.Casa.API.DTOs;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.InterfaceAdapter.Models;
namespace CasaBackend.Casa.Infrastructure.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<DeviceEntity, DeviceDto>();
            CreateMap<CommandDto, CommandEntity>()
                .ForMember(dest => dest.Device, opt => opt.Ignore());
            CreateMap<DimmableModel, DimmableEntity>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Brightness, opt => opt.MapFrom(src => src.Brightness))
                .ReverseMap();
                //.ForMember(dest => dest.DeviceId, opt => opt.Ignore());
            /*CreateMap<LedEntity, DimmableModel>()
                .ForMember(dest => dest.DeviceId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Brightness, opt => opt.MapFrom(src => src.Brightness));*/
        }
    }
}
