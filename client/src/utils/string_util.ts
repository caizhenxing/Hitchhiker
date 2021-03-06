import * as uuid from 'uuid';
import { KeyValuePair } from '../common/key_value_pair';
import { Beautify } from './beautify';
import * as shortId from 'shortid';

export class StringUtil {
    static generateUID(): string {
        return `${uuid.v1()}-${shortId.generate()}`;
    }

    static upperFirstAlphabet(word: string): string {
        if (!word) {
            return word;
        }

        return word[0].toUpperCase() + word.substr(1);
    }

    static readCookies(cookies: string): _.Dictionary<string> {
        const cookieDict: _.Dictionary<string> = {};
        cookies.split(';').map(c => c.trim()).forEach(c => cookieDict[c.substr(0, c.indexOf('=') || c.length)] = c);
        return cookieDict;
    }

    static readCookie(cookie: string): { key: string, value: string } {
        return { key: cookie.substr(0, cookie.indexOf('=') || cookie.length), value: cookie.substr(0, cookie.indexOf(';') || cookie.length) };
    }

    static stringToKeyValues(str: string): Array<KeyValuePair> {
        return str.split('\n').map(k => {
            let [key, ...values] = k.split(':');
            const value: string | undefined = values.length === 0 ? undefined : values.join(':');
            const isActive = !key.startsWith('//');

            if (!isActive) {
                key = key.substr(2);
            }

            return { isActive, key, value };
        });
    }

    static headersToString(headers: Array<KeyValuePair>): string {
        return headers ? headers.map(r => StringUtil.headerToString(r)).join('\n') : '';
    }

    static headerToString(header: KeyValuePair): string {
        const prefix = header.isActive ? '' : '//';
        const key = header.key === undefined || header.key === null ? '' : header.key;
        const value = header.value === undefined || header.value === null ? '' : `:${header.value}`;
        return `${prefix}${key}${value}`;
    }

    static isJson(value: string): boolean {
        try {
            JSON.parse(value);
            return true;
        } catch (ex) {
            return false;
        }
    }

    static beautify(value: string, header?: string, type?: 'json' | 'xml' | 'text') {
        if (!type) {
            type = StringUtil.isJson(value) ? 'json' : (header && header.indexOf('xml') > -1 ? 'xml' : 'text');
        }

        if (type === 'json') {
            return Beautify.json(value);
        } else if (type === 'xml') {
            return Beautify.xml(value);
        } else {
            return value;
        }
    }

    static isNumberString(str: string): boolean {
        const pattern = /^\d+$/;
        return pattern.test(str);
    }

    static checkEmail(email: string): boolean {
        const pattern = /^[^@]+@[^\.@]+\.[a-zA-Z]+$/;
        return pattern.test(email);
    }

    static checkPassword(password: string): boolean {
        const pattern = /^[\da-zA-Z]{6,16}$/;

        return pattern.test(password);
    }

    static getNameFromEmail(email: string): string {
        return email ? email.substr(0, email.lastIndexOf('@')) : '';
    }

    static checkEmails(emails: string | string[]): { success: boolean, message: string, emails: string[] } {
        const separator = ';';
        const emailArr = emails instanceof Array ? emails : emails.split(separator);
        if (!emailArr || emailArr.length === 0) {
            return { success: false, message: 'at least one email', emails: [] };
        }

        const invalidEmailArr = emailArr.filter(e => !StringUtil.checkEmail(e));
        return {
            success: invalidEmailArr.length === 0,
            message: `${invalidEmailArr.join(';')} is invalid`,
            emails: emailArr.filter(e => StringUtil.checkEmail(e))
        };
    }

    static getHostFromUrl(url: string | undefined): string {
        try {
            return new URL(url || '').hostname;
        } catch (e) {
            return url || '';
        }
    }
}
