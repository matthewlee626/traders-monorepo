import io from 'socket.io-client';
const andrewToken =
  'Bearer eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtajdvaWd1eGgudXMuYXV0aDAuY29tLyJ9..riFhAYOsE-jneVcX.PrYMMSAqCQcjYBNIsywr8uKuqryr33iNmqAddeZ5L5W-L9wg7DsHT6SKABVU5T7O8PCNzDxRYjf0bTaF8CdPIrYe7KCEx90fnFCey640Ap4ymUBx4K2rF1aKAt3euq3DIHdvN8YZWnYpxqmkL1mQXK_1WCEylgEHFRTFaF_kI3h77JMU_VwHujS4mthEYbAMm0VWYdBPUpRyTozE5V4PkiQH9vsziIZDUUj_XNAuxXe0jOqi_9c2x0HvCMyb0Ldtd2W4_OYXgvXX_a9hrP8TqY64KOcLqo7cSbRtjNZ3maJXSFLinYlxsGrJ8RT0E9HFZ70GA18zJw.KlV5dT7-yJHM51oOwKOT4w';
const kenzieToken =
  'Bearer eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtajdvaWd1eGgudXMuYXV0aDAuY29tLyJ9..YWnHRW-Y-hog6eLE.CkGcClhJD3Nd80HfTqDkt3Dac1wkRnRuEFeNOF36yVe6EAc8ei34E-syQKnAvxV6fNXgJ3yVN-C2wua-m5-YWKb7ulVHDuC-BWs0py4U_Lg8waHQ_g72hGcqHu-HawJLhhx4grOTb9KdC8mEsXODw02_lPuZ7cfLjjFSPI4eLYzrh_nBVEiVpZb8nH4DEHQoaQCr6BZMRE6cYVSxVcFhVE_xM5OMDVS2-19rADo6UMWKFukSFWYnl1PCuol1dmAEcaA4-NDrnx1ekU_34Qn9-DGCtGOpI6WdKesVuu7XMQh3ms853lWd3R-sc4fIn6f5LSiuX88Sow.H26AYHDihPmG4fVDjJplVw';
var token = kenzieToken;

// const socket = io('https://testingtraders.herokuapp.com/', {
const socket = io('http://localhost:8080', {
  withCredentials: false,
  auth: { token: token },
});
export default socket;
