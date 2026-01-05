import { useState, useEffect, useCallback } from "react";
import { useLunch } from "../context/LunchContext";
import { useAuth } from "../context/AuthContext";

function useLunchData() {
  const { getAllLunchs } = useLunch();
  const { getUsers } = useAuth();
  const [groupedLunchs, setGroupedLunchs] = useState({});
  const [pendingLunches, setPendingLunches] = useState({});
  const [chartData, setChartData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [users, setUsers] = useState([]);

  const loadLunchs = useCallback(async () => {
    try {
      const lunches = await getAllLunchs();
      if (lunches.data.length === 0) {
        setGroupedLunchs({});
        setPendingLunches({});
        return;
      }
      const grouped = {};
      const pending = {};
      lunches.data.forEach((lunch) => {
        const key = lunch.user?.NameStudent || lunch.nameClient;
        const target = lunch.user ? grouped : pending;
        if (!target[key]) target[key] = [];
        target[key].push(lunch);
      });
      setGroupedLunchs(grouped);
      setPendingLunches(pending);
      const dailyCounts = lunches.data.reduce((acc, lunch) => {
        const date = new Date(lunch.date).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartFormattedData = Object.entries(dailyCounts).map(
        ([date, count]) => ({
          date,
          Almuerzos: count,
        })
      );

      const updatedData = chartFormattedData.map((item) => {
        const dateParts = item.date.split("-");
        let year = parseInt(dateParts[0]);
        let month = parseInt(dateParts[1]) - 1;
        let day = parseInt(dateParts[2]);

        const dateObject = new Date(year, month, day);
        dateObject.setDate(dateObject.getDate() + 1);

        const newYear = dateObject.getFullYear();
        const newMonth = (dateObject.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const newDay = dateObject.getDate().toString().padStart(2, "0");

        return {
          ...item,
          date: `${newYear}-${newMonth}-${newDay}`,
        };
      });
      setChartData(updatedData);
      const dataTable = Object.entries(grouped).map(([studentName, lunchs]) => {
        const totalAmount = lunchs.reduce(
          (sum, lunch) => (!lunch.pay ? sum + lunch.userNeedsPay : sum),
          0
        );

        const pendingPayments = lunchs.filter((lunch) => !lunch.pay).length;
        const phoneNumberReal = lunchs[0]?.user.PhoneNumberReal || "";

        return {
          id: studentName,
          amount: totalAmount,
          Pending: pendingPayments,
          PhoneNumberReal: phoneNumberReal,
        };
      });
      setDataTable(dataTable);
    } catch (error) {
      console.error("Error cargando almuerzos:", error);
    }
  }, [getAllLunchs]);

  useEffect(() => {
    loadLunchs();
  }, [loadLunchs]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        console.log(error);
      }
    };
    loadUsers();
  }, [getUsers]);

  return {
    groupedLunchs,
    pendingLunches,
    chartData,
    dataTable,
    users,
    loadLunchs,
  };
}

export default useLunchData;
