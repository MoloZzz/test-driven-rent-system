export interface CreateReservationDto {
  roomId: number;
  userId: number;
  checkIn: Date;
  checkOut: Date;
}
