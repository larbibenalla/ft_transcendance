// app.service.ts

import { Injectable } from '@nestjs/common';

// user interface
export interface IUser {
  id: number;
  name: string;
  age: number;
}

@Injectable()
export class AppService {
  // list of users
  private users: IUser[] = [
    {
      id: 3,
      name: 'Tamilan',
      age: 23,
    },
    {
      id: 4,
      name: 'Nandha',
      age: 24,
    },
    {
      id: 5,
      name: 'Nandha Kumar',
      age: 24,
    },
  ];
}