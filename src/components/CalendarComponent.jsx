"use client"
import { useState } from 'react';

export default function CalendarComponent({ onDateSelect, selectedDate }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    const today = new Date();
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        // Días del mes anterior
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const prevDay = new Date(year, month, -i);
            days.push({
                date: prevDay,
                isCurrentMonth: false,
                isToday: false,
                isSelected: false
            });
        }
        
        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            days.push({
                date,
                isCurrentMonth: true,
                isToday,
                isSelected
            });
        }
        
        // Días del siguiente mes para completar la grilla
        const remainingCells = 42 - days.length; // 6 filas × 7 días = 42 celdas
        for (let day = 1; day <= remainingCells; day++) {
            const nextDay = new Date(year, month + 1, day);
            days.push({
                date: nextDay,
                isCurrentMonth: false,
                isToday: false,
                isSelected: false
            });
        }
        
        return days;
    };

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const handleDateClick = (day) => {
        if (onDateSelect) {
            onDateSelect(day.date);
        }
        setIsOpen(false);
    };

    const formatSelectedDate = () => {
        if (!selectedDate) return 'Seleccionar fecha';
        return selectedDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const days = getDaysInMonth(currentMonth);

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg bg-white text-left flex items-center justify-between hover:border-[#2c2c2c] focus:outline-none focus:border-[#2c2c2c] transition-all duration-300"
            >
                <div className="flex items-center gap-2">
                    <i className="fas fa-calendar-alt text-[#666]"></i>
                    <span className={selectedDate ? 'text-[#2c2c2c]' : 'text-[#666]'}>
                        {formatSelectedDate()}
                    </span>
                </div>
                <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-[#666] text-sm transition-transform duration-200`}></i>
            </button>

            {/* Calendar Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-[#e5e5e5] rounded-lg shadow-xl z-50 p-4 w-80">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f8f9fa] transition-colors duration-200"
                        >
                            <i className="fas fa-chevron-left text-[#666] text-sm"></i>
                        </button>
                        
                        <h3 className="text-lg font-semibold text-[#2c2c2c]">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        
                        <button
                            onClick={() => navigateMonth(1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f8f9fa] transition-colors duration-200"
                        >
                            <i className="fas fa-chevron-right text-[#666] text-sm"></i>
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map(day => (
                            <div key={day} className="text-center text-sm font-medium text-[#666] py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => (
                            <button
                                key={index}
                                onClick={() => handleDateClick(day)}
                                className={`
                                    w-9 h-9 text-sm rounded-lg flex items-center justify-center transition-all duration-200
                                    ${day.isCurrentMonth 
                                        ? day.isSelected
                                            ? 'bg-[#2c2c2c] text-white font-semibold'
                                            : day.isToday
                                                ? 'bg-[#f0f0f0] text-[#2c2c2c] font-semibold'
                                                : 'text-[#2c2c2c] hover:bg-[#f8f9fa]'
                                        : 'text-[#ccc] hover:text-[#666] hover:bg-[#f8f9fa]'
                                    }
                                `}
                            >
                                {day.date.getDate()}
                            </button>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-[#f0f0f0]">
                        <button
                            onClick={() => handleDateClick({ date: today })}
                            className="flex-1 py-2 px-3 text-sm bg-[#f8f9fa] text-[#2c2c2c] rounded-lg hover:bg-[#e9ecef] transition-colors duration-200"
                        >
                            Hoy
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-2 px-3 text-sm bg-[#2c2c2c] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}