﻿using CasaBackend.Casa.Application.Interfaces.Providers;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;
using Microsoft.EntityFrameworkCore;

namespace CasaBackend.Casa.Infrastructure.Providers
{
    public class CapabilityProvider<TModel> : ICapabilityProvider
        where TModel : class, ICapabilityModel
    {
        private readonly AppDbContext dbContext;
        public CapabilityProvider(AppDbContext appDbContext) 
        {
            dbContext = appDbContext;
        }
        public async Task<ICapabilityModel?> GetByDeviceIdAsync(int deviceId)
        {
            return await dbContext.Set<TModel>().FirstOrDefaultAsync(m => m.DeviceId == deviceId);
        }

        public async Task<Dictionary<int, ICapabilityModel>> GetAllAsync()
        {
            return await dbContext.Set<TModel>().ToDictionaryAsync(m => m.DeviceId, m => (ICapabilityModel)m);
        }
    }
}