namespace ConnectCampus.Domain.Common;

public abstract class Entity
{
    public Guid Id { get; private set; }

    protected Entity(Guid id)
    {
        Id = id;
    }

    protected Entity()
    {
    }
} 