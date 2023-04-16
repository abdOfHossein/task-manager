import { Injectable } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

@Injectable()
export class updatePostTable1672484099418 implements MigrationInterface{
    name?: 'updatePostTable1672484099418';
    transaction?: boolean;
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE SCHEMA "auth";')
        await queryRunner.query('CREATE SCHEMA "menu";')
        await queryRunner.query('CREATE SCHEMA "message";')
     //    await queryRunner.query('CREATE SCHEMA "public";')
        await queryRunner.query('CREATE SCHEMA "task";')
    }
    down(queryRunner: QueryRunner): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
}