import React, { useState, useEffect } from "react";
import { Calendar, Button, Alert, Spin, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOfflineDates,
  updateOfflineDatesAsync,
  selectOfflineDates,
  selectOfflineDatesStatus,
  selectOfflineDatesError,
} from "../../../../store/admin/offlineDatesSlice";
import moment from "moment";

function OfflineDateManager() {
  const offlineDatesObject = useSelector(selectOfflineDates) || {}; // Get the object, default to {}
  const offlineDates = offlineDatesObject.offlineDates || []; // Access the array, default to []

  const status = useSelector(selectOfflineDatesStatus);
  const error = useSelector(selectOfflineDatesError);
  const dispatch = useDispatch();
  const [selectedDates, setSelectedDates] = useState([]); // Moment objects

  useEffect(() => {
    dispatch(fetchOfflineDates());
  }, [dispatch]);

  const isDateOffline = (date) => {
    if (!offlineDates || !Array.isArray(offlineDates)) {
      console.log("No offline dates available");
      return false;
    }

    // Log the current date being checked and all offline dates

    const isOffline = offlineDates.some((offlineDate) => {
      const offlineDateMoment = moment(offlineDate);
      const offlineDateFormatted = offlineDateMoment.format("YYYY-MM-DD");
      const currentDateFormatted = date.format("YYYY-MM-DD");

      const isSame = offlineDateFormatted === currentDateFormatted;

      // Only log matches to reduce console noise
      if (isSame) {
        console.log(
          `✅ MATCH FOUND: Calendar date ${currentDateFormatted} matches offline date ${offlineDateFormatted}`
        );
      }
      return isSame;
    });

    return isOffline;
  };

  const handleDateSelect = (date) => {
    const isSelected = selectedDates.some((selectedDate) =>
      selectedDate.isSame(date, "day")
    );

    if (isSelected) {
      setSelectedDates(
        selectedDates.filter(
          (selectedDate) => !selectedDate.isSame(date, "day")
        )
      );
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSave = () => {
    // Convert offlineDates to "YYYY-MM-DD" format for comparison
    const offlineDatesSet = new Set(
      offlineDates.map((date) => moment(date).format("YYYY-MM-DD"))
    );

    // Separate dates to add and remove
    const { toAdd, toRemove } = selectedDates.reduce(
      (acc, selectedDate) => {
        const formattedDate = selectedDate.format("YYYY-MM-DD");

        if (offlineDatesSet.has(formattedDate)) {
          acc.toRemove.push(formattedDate); // Remove if already offline
        } else {
          acc.toAdd.push(selectedDate.toISOString()); // Add if not offline
        }

        return acc;
      },
      { toAdd: [], toRemove: [] }
    );

    // Filter out removed dates from offlineDates
    const updatedOfflineDates = offlineDates.filter(
      (offlineDate) =>
        !toRemove.includes(moment(offlineDate).format("YYYY-MM-DD"))
    );

    // Add new dates
    const finalOfflineDates = [...updatedOfflineDates, ...toAdd];

    // Dispatch update action
    dispatch(updateOfflineDatesAsync(finalOfflineDates));

    // Clear selected dates after saving
    setSelectedDates([]);
  };

  const dateCellRender = (date) => {
    const isOffline = isDateOffline(date);
    const isSelected = selectedDates.some((selectedDate) =>
      selectedDate.isSame(date, "day")
    );

    let cellClass = "";
    if (isOffline) {
      cellClass += "offline-date";
    }
    if (isSelected) {
      cellClass += "selected-date";
    }

    return (
      <div className={cellClass}>
        {cellClass === "offline-date" ? <h1 className="closed-date-calender">Closed</h1> : null}
        {cellClass === "selected-date" ? "Selected" : null}
        {/* You can add content here if you want */}
      </div>
    );
  };

  const getClassName = (date) => {
    const isOffline = isDateOffline(date);
    const isSelected = selectedDates.some((selectedDate) =>
      selectedDate.isSame(date, "day")
    );
    if (isOffline) {
      return "offline-date";
    }
    if (isSelected) {
      return "selected-date";
    }
  };

  return (
    <div className="offline-date-manager">
      <h2 style={{margin:"0px "}}>Manage Clinic Offline Dates</h2>

      {error && <Alert message={`Error: ${error}`} type="error" showIcon />}
      {status === "loading" && <Spin size="large" />}
      {selectedDates.length ? (
        <Button
          type="primary"
          onClick={handleSave}
          disabled={status === "loading"}
        >
          Save Changes
        </Button>
      ) : null}
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={handleDateSelect}
        className="my-calendar"
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];

          let current = value.clone();
          const localeData = moment.localeData();
          const months = localeData.monthsShort();

          for (let index = 0; index < 12; index++) {
            monthOptions.push({ label: months[index], value: index });
            current = current.add(1, "month");
          }

          const years = [];
          for (let i = start; i < end; i++) {
            years.push(i);
          }
          return (
            <div
              style={{
                padding: 8,
              }}
            >
              <Typography.Title level={5} style={{ margin: 0 }}>
                {value.format("MMMM YYYY")}
              </Typography.Title>
            </div>
          );
        }}
        style={{ width: "100%" }}
        cellClassName={getClassName}
      />
    </div>
  );
}

export default OfflineDateManager;
