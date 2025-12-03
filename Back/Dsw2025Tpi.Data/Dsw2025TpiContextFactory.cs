using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Dsw2025Tpi.Data
{
    public class Dsw2025TpiContextFactory : IDesignTimeDbContextFactory<Dsw2025TpiContext>
    {
        public Dsw2025TpiContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<Dsw2025TpiContext>();

            // Reemplazar por tu cadena de conexión real
            optionsBuilder.UseSqlServer(
                "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=Dsw2025TpiDb;Integrated Security=True;"
            );

            return new Dsw2025TpiContext(optionsBuilder.Options);
        }
    }
}
