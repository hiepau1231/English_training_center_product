import Joi from 'joi';

export const replaceTeacherSchema = Joi.object({
    newTeacherId: Joi.number().required().messages({
        'number.base': 'Teacher ID must be a number',
        'any.required': 'Teacher ID is required'
    })
});

export const replaceRoomSchema = Joi.object({
    newRoomId: Joi.number().required().messages({
        'number.base': 'Room ID must be a number',
        'any.required': 'Room ID is required'
    })
});

export const rescheduleClassSchema = Joi.object({
    startTime: Joi.string().required().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).messages({
        'string.pattern.base': 'Start time must be in HH:mm format',
        'any.required': 'Start time is required'
    }),
    endTime: Joi.string().required().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).messages({
        'string.pattern.base': 'End time must be in HH:mm format',
        'any.required': 'End time is required'
    })
}).custom((value, helpers) => {
    const { startTime, endTime } = value;
    if (startTime >= endTime) {
        return helpers.error('any.invalid', { 
            message: 'End time must be after start time'
        });
    }
    return value;
}); 