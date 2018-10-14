using System.Collections.Generic;
using System.Linq;

namespace Umbraco.Core.Events
{
    /// <summary>
    /// Event messages collection
    /// </summary>
    public sealed class EventMessages : DisposableObjectSlim
    {
        private readonly List<EventMessage> _msgs = new List<EventMessage>();

        public void Add(EventMessage msg)
        {
            _msgs.Add(msg);
        }

        public int Count
        {
            get { return _msgs.Count; }
        }

        public IEnumerable<EventMessage> GetAll()
        {
            return _msgs;
        }

        public IEnumerable<EventMessage> GetAll(EventMessageType messageType)
        {
            return _msgs.Where(m => m.MessageType == messageType);
        }

        protected override void DisposeResources()
        {
            _msgs.Clear();
        }
    }
}
