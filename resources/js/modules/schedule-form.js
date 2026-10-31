export const toggleRoomField = () => {
    document.querySelectorAll('[data-schedule-form]').forEach((form) => {
        const classTypeSelect = form.querySelector('[data-class-type]');
        const subjectSelect = form.querySelector('select[name="subject_id"]');
        const roomWrapper = form.querySelector('[data-room-wrapper]');
        const roomSelect = form.querySelector('select[name="room_id"]');
        const setSelect = form.querySelector('select[name="set_id"]');
        const roomCapacity = form.querySelector('[data-room-capacity]');
        const studentCount = form.querySelector('[data-student-count]');
        const gcodeWrapper = form.querySelector('[data-gcode-wrapper]');
        const matchExistingColorSwitch = form.querySelector('input[name="match_existing_color"]');
        const colorValueInput = form.querySelector('[data-color-value]');
        const colorPickerTrigger = form.querySelector('[data-color-picker-trigger]');
        const colorPicker = form.querySelector('[data-color-picker]');
        const colorState = form.querySelector('[data-color-state]');
        const colorStateLabel = form.querySelector('[data-color-state-label]');
        const colorSwatch = form.querySelector('[data-color-swatch]');
        const colorPickerFill = form.querySelector('[data-color-picker-fill]');
        const colorStateIcon = form.querySelector('[data-color-state-icon]');
        const matchingColorsRaw = form.dataset.matchingColors || '{}';
        const inheritedColorSeed = form.dataset.inheritedColor || '';
        let matchingColors = {};

        try {
            matchingColors = JSON.parse(matchingColorsRaw);
        } catch {
            matchingColors = {};
        }

        if (!classTypeSelect || !roomWrapper) {
            return;
        }

        const initialSubjectId = subjectSelect?.value || '';
        const initialSetId = setSelect?.value || '';

        const updateVisibility = () => {
            const isOnline = classTypeSelect.value === 'online';

            roomWrapper.classList.toggle('d-none', isOnline);

            if (gcodeWrapper) {
                gcodeWrapper.classList.toggle('d-none', !isOnline);
            }
        };

        classTypeSelect.addEventListener('change', updateVisibility);
        updateVisibility();

        const shouldMatchExistingColor = () => matchExistingColorSwitch ? matchExistingColorSwitch.checked : true;

        const setColorState = (color, label = 'Using matched color') => {
            if (colorValueInput) {
                colorValueInput.value = color || '';
            }

            if (colorSwatch) {
                colorSwatch.style.backgroundColor = color || 'transparent';
                colorSwatch.classList.toggle('d-none', !color);
            }

            if (colorPickerFill) {
                colorPickerFill.style.backgroundColor = color || '#ffffff';
            }

            if (colorPickerTrigger) {
                colorPickerTrigger.classList.toggle('is-empty', !color);
            }

            if (colorStateIcon) {
                colorStateIcon.classList.toggle('d-none', !!color);
            }

            if (colorStateLabel) {
                const nextLabel = color ? label : 'No color';
                colorStateLabel.textContent = nextLabel;
                colorStateLabel.classList.toggle('d-none', false);
                colorStateLabel.classList.toggle('schedule-color-empty', !color);
            }

            if (colorState) {
                colorState.dataset.hasColor = color ? '1' : '0';
            }
        };

        const applyInheritedColor = () => {
            if (!shouldMatchExistingColor()) {
                return;
            }

            if (!subjectSelect || !setSelect || !colorPicker) {
                return;
            }

            const subjectId = subjectSelect.value;
            const setId = setSelect.value;

            if (!subjectId || !setId) {
                return;
            }

            const isOriginalSelection = subjectId === initialSubjectId && setId === initialSetId;
            const inheritedColor = isOriginalSelection && inheritedColorSeed
                ? inheritedColorSeed
                : matchingColors[`${subjectId}:${setId}`];

            if (!inheritedColor) {
                setColorState('');
                return;
            }

            setColorState(inheritedColor);

            if (colorPicker) {
                colorPicker.value = inheritedColor;
                colorPicker.disabled = true;
            }
        };

        const updateRoomCapacity = () => {
            if (!roomSelect || !roomCapacity) {
                return;
            }

            const selected = roomSelect.options[roomSelect.selectedIndex];
            const capacity = selected?.dataset?.capacity;
            roomCapacity.textContent = capacity ? `Capacity: ${capacity}` : 'Capacity: -';
        };

        const updateStudentCount = () => {
            if (!setSelect || !studentCount) {
                return;
            }

            const selected = setSelect.options[setSelect.selectedIndex];
            const students = selected?.dataset?.students;
            studentCount.textContent = students ? `Students: ${students}` : 'Students: -';
        };

        if (roomSelect) {
            roomSelect.addEventListener('change', updateRoomCapacity);
            updateRoomCapacity();
        }

        if (setSelect) {
            setSelect.addEventListener('change', updateStudentCount);
            setSelect.addEventListener('change', applyInheritedColor);
            updateStudentCount();
        }

        if (subjectSelect) {
            subjectSelect.addEventListener('change', applyInheritedColor);
        }

        if (matchExistingColorSwitch) {
            matchExistingColorSwitch.addEventListener('change', () => {
                if (matchExistingColorSwitch.checked) {
                    if (colorPicker) {
                        colorPicker.disabled = true;
                    }
                    applyInheritedColor();
                } else {
                    if (colorPicker) {
                        colorPicker.disabled = false;
                    }
                    setColorState('');
                }
            });
        }

        if (colorPicker) {
            colorPicker.addEventListener('input', () => {
                if (colorValueInput) {
                    colorValueInput.value = colorPicker.value;
                }

                if (colorStateLabel) {
                    colorStateLabel.textContent = 'Color selected';
                }
                setColorState(colorPicker.value, 'Color selected');
            });
        }

        if (matchExistingColorSwitch?.checked) {
            applyInheritedColor();
        } else {
            setColorState(colorValueInput?.value || '');
            if (colorPicker) {
                colorPicker.disabled = false;
            }
        }
    });
};
