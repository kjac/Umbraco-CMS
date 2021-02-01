﻿using System;
using System.Text;
using Umbraco.Core.Events;

namespace Umbraco.Web.Common.ModelBinders
{
    /// <summary>
    /// Contains event data for the <see cref="ModelBindingException"/> event.
    /// </summary>
    public class ModelBindingError : INotification
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ModelBindingError"/> class.
        /// </summary>
        public ModelBindingError(Type sourceType, Type modelType, StringBuilder message)
        {
            SourceType = sourceType;
            ModelType = modelType;
            Message = message;
        }

        /// <summary>
        /// Gets the type of the source object.
        /// </summary>
        public Type SourceType { get; set; }

        /// <summary>
        /// Gets the type of the view model.
        /// </summary>
        public Type ModelType { get; set; }

        /// <summary>
        /// Gets the message string builder.
        /// </summary>
        /// <remarks>Handlers of the event can append text to the message.</remarks>
        public StringBuilder Message { get; }

        /// <summary>
        /// Gets or sets a value indicating whether the application should restart.
        /// </summary>
        public bool Restart { get; set; }
    }
}
